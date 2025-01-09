import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import ProfilePage from '../profile';
import { graphql, fetchQuery } from 'react-relay';
import { initRelayEnvironment } from '../../RelayEnvironment';

const loginPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [jobApplications, setJobApplications] = useState([]);
  
  const handlelogin = async () => {
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
          freelancerJobApplications(
            first: 5
          ) {
            totalCount
            edges {
              node {
                status
                contract {
                  id
                }
                job {
                  title
                  slug
                  id
                }
              }
            }
          }
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
          login with API Key
        </Typography>
        <TextField
          label="API Key"
          variant="outlined"
          fullWidth
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handlelogin} style={{ marginTop: '20px' }}>
          login
        </Button>
      </Container>
    )}
    </>
  );
};

export default loginPage;
