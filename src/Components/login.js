import React, { useState } from 'react';
import { Button, Input, Box, Center, FormControl, FormLabel } from '@chakra-ui/react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      
      const response = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin();
      } else {
        console.error('Login failed', data);
      }
    } catch (error) {
      console.error('Error during login', error);
    }
  };

  return (
    <Center h="100vh">
      <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </FormControl>

        <FormControl mt={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </FormControl>

        <Button colorScheme="teal" mt={4} onClick={handleLogin}>
          Login
        </Button>
      </Box>
    </Center>
  );
};

export default Login;
