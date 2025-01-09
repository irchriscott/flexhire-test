"use client";

import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Avatar, 
  Grid, 
  FormControl, 
  MenuItem, 
  InputLabel, 
  Select 
} from '@mui/material';
import axios from 'axios';

const API_BASE_URL = "http://localhost:3000/graphql";

type ProfilePageProps = {
  userData: any;
  apiKey: string;
};

const ProfilePage: React.FC<ProfilePageProps> = ({ userData, apiKey }) => {

  const [visibility, setVisibility] = useState(userData.visibility);

  //I was unable to test this as I couldn't find the GraphQL API endpoint for this particular mutation
  const updateVisibility = async (newVisibility: string) => {
    try {
      await axios.post(API_BASE_URL, {
        query: `mutation {
          updateVisibility(visibility: "${newVisibility}") {
            visibility
          }
        }`,
        apiKey,
      });
      setVisibility(newVisibility);
    } catch (error) {
      console.error('Update visibility error:', error);
    }
  };

  return (
    <Container>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Avatar src={userData.avatarUrl} alt={userData.name} />
        </Grid>
        <Grid item>
          <Typography variant="h5">{userData.name}</Typography>
        </Grid>
      </Grid>
      <Typography variant="h6" gutterBottom>Skills:</Typography>
      <ul>
        {userData.userSkills.map((skill: any, index: number) => (
          <li key={index}>{skill.skill.name}</li>
        ))}
      </ul>
      <Typography variant="h6" gutterBottom>Job Applications:</Typography>
      <ul>
        {userData.jobApplications.map((job: any, index: number) => (
          <li key={index}>{job.title}</li>
        ))}
      </ul>
      <FormControl fullWidth style={{ marginTop: '20px' }}>
        <InputLabel>Visibility</InputLabel>
        <Select
          value={visibility}
          onChange={(e) => updateVisibility(e.target.value)}
        >
          <MenuItem value="private">Private</MenuItem>
          <MenuItem value="public">Public</MenuItem>
          <MenuItem value="clients_only">Clients Only</MenuItem>
        </Select>
      </FormControl>
    </Container>
  );
};

export default ProfilePage;