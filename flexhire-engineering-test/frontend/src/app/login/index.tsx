import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Avatar, Grid, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import ProfilePage from '../profile';

const API_BASE_URL = "http://localhost:3000/graphql";

const LoginPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [userData, setUserData] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await axios.post(API_BASE_URL, {
        query: `{
            currentUser {
              name,
              avatarUrl,
              visibility,
              userSkills {
                experience,
                skill {
                  name
                }
              },
              profile {
                visibility
              },
              jobApplications {
                edges {
                  node {
                    job {
                      title
                    }
                  }
                }
              }
            },
          }`,
        apiKey: apiKey,
      });

      if (response.data.errors) {
        alert('Invalid API Key');
        return;
      }

      const data = response.data.data.currentUser;
      setUserData(data);
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to login');
    }
  };

  return (
    <>
    {userData ? <ProfilePage userData={userData} apiKey={apiKey} /> : (
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Login with API Key
        </Typography>
        <TextField
          label="API Key"
          variant="outlined"
          fullWidth
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin} style={{ marginTop: '20px' }}>
          Login
        </Button>
      </Container>
    )}
    </>
  );
};

export default LoginPage;
