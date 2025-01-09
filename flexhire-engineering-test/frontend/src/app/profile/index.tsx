"use client";

import React from 'react';
import { Container, Typography, Avatar, Grid } from '@mui/material';

type ProfilePageProps = {
  userData: any;
};

const ProfilePage: React.FC<ProfilePageProps> = ({ userData }) => {
  return (
    <Container>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Avatar src={userData.avatar} alt={userData.name} />
        </Grid>
        <Grid item>
          <Typography variant="h5">{userData.name}</Typography>
        </Grid>
      </Grid>
      <Typography variant="h6" gutterBottom>Skills:</Typography>
      <ul>
        {userData.skills.map((skill: any, index: number) => (
          <li key={index}>{skill.name}</li>
        ))}
      </ul>
      <Typography variant="h6" gutterBottom>Job Applications:</Typography>
      <ul>
        {userData.jobApplications.map((job: any, index: number) => (
          <li key={index}>{job.title}</li>
        ))}
      </ul>
    </Container>
  );
};

export default ProfilePage;