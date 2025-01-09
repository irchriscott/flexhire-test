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
import { graphql, commitMutation } from 'react-relay';
import { initRelayEnvironment } from '../../RelayEnvironment';

type ProfilePageProps = {
  userData: any;
  apiKey: string;
};

const ProfilePage: React.FC<ProfilePageProps> = ({ userData, apiKey }) => {

  const [visibility, setVisibility] = useState(userData.profile.visibility);

  const updateVisibility = (newVisibility: string) => {
    const mutation = graphql`
      mutation profileUpdateVisibilityMutation($input: UpdateUserInput!) {
        updateUser(input: $input) {
          user {
            profile {
              visibility
            }
          }
        }
      }
    `;

    commitMutation(initRelayEnvironment(), {
      mutation,
      variables: { input: { profile: { visibility: newVisibility } } },
      onCompleted: (response: any) => {
        setVisibility(newVisibility);
      },
      onError: (err) => console.error(err),
    });
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
      <Typography variant="h6" sx={{mt: 3}} gutterBottom>Skills:</Typography>
      <ul style={{ marginLeft: '40px' }}>
        {userData.userSkills.map((skill: any, index: number) => (
          <li key={index}>{skill.skill.name}: {skill.experience} years</li>
        ))}
      </ul>
      <Typography variant="h6" sx={{mt: 3}} gutterBottom>Job Applications:</Typography>
      <ul>
        {userData.jobApplications.nodes.map((job: any, index: number) => (
          <li key={index}>{job.title}</li>
        ))}
      </ul>
      <FormControl fullWidth style={{ marginTop: '20px' }}>
        <InputLabel>Visibility</InputLabel>
        <Select
          value={visibility}
          onChange={(e) => updateVisibility(e.target.value)}
        >
          <MenuItem value="visibility_private">Private</MenuItem>
          <MenuItem value="visibility_public">Public</MenuItem>
          <MenuItem value="visibility_clients">Clients Only</MenuItem>
        </Select>
      </FormControl>
    </Container>
  );
};

export default ProfilePage;