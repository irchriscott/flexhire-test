# Architecture Design Document: Real-Time Profile - Job Matching System

## Overview
This document outlines the architectural design for a system that matches profiles to job requirements in real-time, ensuring high performance, scalability, and adherence to functional requirements. The proposed system will prioritize the profiles that meet the requirements at the top of the results and highlight the profiles that didn't meet the requirements

---

## Data Structures
### Database Tables

#### Profiles Table
Stores candidate information:
```sql
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address JSONB,
    education JSONB,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
- **address**: `{ street, city, state, zip_code, country }`
- **education**: `{ degree, university, graduation_year }`

#### Work Experience Table
Stores work experience as a one-to-many relationship:
```sql
CREATE TABLE work_experiences (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE,
    company VARCHAR(255),
    position VARCHAR(255),
    start_date DATE,
    end_date DATE,
    description TEXT
);
```

#### Skills Table
Stores skills as a many-to-many relationship:
```sql
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE
);

CREATE TABLE profile_skills (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE
);
```

#### Jobs Table
Stores job requirements:
```sql
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    location VARCHAR(255),
    min_experience_years INTEGER,
    required_skills JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
- **required_skills**: JSON array, e.g., `[ {"skill": "Ruby", "years": 3}, {"skill": "SQL", "years": 2} ]`

#### Indexes
- **GIN Indexes** for JSONB columns:
  ```sql
  CREATE INDEX idx_profiles_address ON profiles USING GIN (address);
  CREATE INDEX idx_profiles_education ON profiles USING GIN (education);
  CREATE INDEX idx_jobs_required_skills ON jobs USING GIN (required_skills);
  ```
- We could use BTREE index on `email` for quick lookup.

---

## Key Code Structures
### Classes and Methods

#### Profile
```ruby
class Profile < ApplicationRecord
  has_many :work_experiences
  has_many :profile_skills
  has_many :skills, through: :profile_skills

  # This will calculate the total years of experience by calculating all the work expriences's dates
  # end_date - start_date 
  # This code can be improved by calculating overlaps like if someone is working multiple jobs at the same # time.
  def total_experience
    work_experiences.sum { |we| (we.end_date || Date.today) - we.start_date }.to_i / 365
  end
end
```

#### Skill
```ruby
class Skill < ApplicationRecord
  has_many :profile_skills
  has_many :profiles, through: :profile_skills
end
```

#### Job
```ruby
class Job < ApplicationRecord
  def required_skill_names
    required_skills.map { |rs| rs['skill'] }
  end
end
```

#### ProfileMatcherService
```ruby
class ProfileMatcherService
  def find_matches(job_id:)
    job = Job.find(job_id)
    profiles = filter_profiles(job)
    ranked_profiles = score_profiles(profiles, job)
    ranked_profiles.map { |profile| validate_requirements(profile, job) }
  end

  private

  def filter_profiles(job)
    Profile.joins(:profile_skills, :skills)
           .where("address->>'country' = ?", job.location)
           .where("total_experience >= ?", job.min_experience_years)
  end

  def score_profiles(profiles, job)
    profiles.sort_by do |profile|
      matched_skills = profile.skills & job.required_skill_names
      matched_skills.length
    end.reverse
  end

  def validate_requirements(profile, job)
    missing_skills = job.required_skill_names - profile.skills.pluck(:name)
    { profile: profile, missing_skills: missing_skills }
  end
end
```

---

## Algorithms and Processes
### Matching Algorithm
1. **Filter by Location**: Compare job `location` with profile `address->>'country'`.
2. **Filter by Experience**: Calculate total years of experience from `work_experiences`.
3. **Match Skills**: Compare `required_skills` from the job with `skills` from the profile.
4. **Score Profiles**:
   - Calculate a match score based on the number of matched skills and years of relevant experience.
   - Design an improved or an advanced score matching algorythm by setting priorities for the job requirements:
        - For example: prioritize skills over location, expirience over education, etc
        - This can go for softskills as well.
5. **Validation**:
   - Identify profiles that didn't meet the requirements (or minimum requirements).
   - 

### SQL Query for Matching
```sql
SELECT
    p.id AS profile_id,
    p.first_name || ' ' || p.last_name AS full_name,
    p.email,
    COALESCE(SUM(DATE_PART('year', we.end_date) - DATE_PART('year', we.start_date)), 0) AS total_experience_years,
    ARRAY_AGG(s.name) AS skills,
    ARRAY(
        SELECT rs->>'skill'
        FROM jsonb_array_elements(j.required_skills) rs
        WHERE rs->>'skill' NOT IN (
            SELECT name FROM skills
            JOIN profile_skills ps ON ps.skill_id = skills.id
            WHERE ps.profile_id = p.id
        )
    ) AS missing_skills
FROM profiles p
LEFT JOIN work_experiences we ON p.id = we.profile_id
LEFT JOIN profile_skills ps ON p.id = ps.profile_id
LEFT JOIN skills s ON ps.skill_id = s.id
JOIN jobs j ON j.id = :job_id
WHERE j.location = p.address->>'country'
GROUP BY p.id, j.id
ORDER BY total_experience_years DESC;
```

---

## Potential Shortcomings and Improvements
### Shortcomings
1. **Scalability**: As the dataset grows, queries may slow down. That's why we can use `Redis` for cashing oldest profiles and use them as priority when calculating the scoring. We could be using a background job to be updating the cashe.
2. **Skill Matching Complexity**: This can limit us from finding closest match for skills and other requirement: for typo maybe or synonyms. We could create an algorythm or a dataset lookup to take care of this.
3. **Real-Time Updates**: New profiles or job changes might not reflect instantly without manual cache invalidation.


## Software Libraries and Tools
- **Redis**: to cache query results to improve response times.
- **pg_search**: for advanced PostgreSQL querying.

### Improvements
1. **Semantic Skill Matching**: we could use a natural language processing (NLP) to match skills semantically.
2. **Materialized Views**: precompute profile-job matches to speed up queries especially for the common jobs.
3. **Async Processing**: for background jobs for scoring and ranking updates.


There are improvement that could be needed for this system but this can do for the limitted time I was given.
