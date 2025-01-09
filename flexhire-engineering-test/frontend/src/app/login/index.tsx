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
      query loginUserDataQuery {
        currentUser {
          name,
          avatarUrl,
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
            nodes {
              job {
                title
              }
            }
          }
        },
      }
    `;

    await localStorage.setItem('apiKey', apiKey);

    try {
      const variables = {};
      const data = await fetchQuery(initRelayEnvironment(), query, variables).toPromise() as any;
      setUserData(data?.currentUser);
      setError(null);
    } catch (err: any) {
      console.log(err);
      setError(err.message);
      setUserData(null);
    }
  };

  return (
    <>
    {userData ? (
        <>
        <ProfilePage userData={userData} apiKey={apiKey} />
        {error && <Typography variant="h6" color="error">{error}</Typography>}
        </>
      ) : (
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
