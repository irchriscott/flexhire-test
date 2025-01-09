import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import ProfilePage from '../profile';
import { graphql, fetchQuery } from 'react-relay';
import { initRelayEnvironment } from '../../RelayEnvironment';

const LoginPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  

  const handleLogin = async () => {
    const query = graphql`
      query GetUserDataQuery {
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
      }
    `;

    try {
      const variables = {};
      const data = await fetchQuery(initRelayEnvironment(), query, variables, {
        fetchOptions: {
          headers: {
            Authorization: apiKey,
          },
        },
      }).toPromise();
      const user = data?.data?.currentUser;
      setUserData(user);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setUserData(null);
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
