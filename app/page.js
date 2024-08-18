'use client';

import { AppBar, Container, Toolbar, Typography, Button, Box, Grid, Link } from "@mui/material";
import { useRouter } from 'next/navigation';
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import Head from "next/head";

const boxStyle = {
  p: 4,
  border: '1px solid',
  borderColor: 'grey.300',
  borderRadius: '12px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s, background-color 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-10px)',
    backgroundColor: 'primary.light',
    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
  },
  height: '100%'
};

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const handleClickGenerate = () => {
    if (isSignedIn) {
      router.push("/generate");
    } else {
      router.push("/sign-in");
    }
  };

  const handleClickCollections = () => {
    if (isSignedIn) {
      router.push("/flashcards");
    } else {
      router.push("/sign-in");
    }
  };

  const handleSubmitBasic = async () => {
    const checkoutSession = await fetch('/api/checkout_session_basic', {
      method: "POST",
      headers: {
        origin: 'http://localhost:3000'
      }
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id
    });

    if (error) {
      console.warn(error.message);
    }
  };

  const handleSubmitPro = async () => {
    const checkoutSession = await fetch('/api/checkout_session_pro', {
      method: "POST",
      headers: {
        origin: 'http://localhost:3000'
      }
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id
    });

    if (error) {
      console.warn(error.message);
    }
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create Flashcard from your text"/>
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
            <Typography variant="h6" style={{flexGrow: 1}}>
              Flashcard SaaS
            </Typography>
          </Link>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h2">Welcome to Flashcard SaaS</Typography>
        <Typography variant="h5">The easiest way to make flashcards from your text</Typography>
        <Box sx={{ textAlign: 'center', my: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleClickGenerate}>Create Flashcards</Button>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleClickCollections}>View Flashcard Collections</Button>
        </Box>
      </Box>

      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Features</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={boxStyle}>
              <Typography variant="h6" gutterBottom>Easy Text Input</Typography>
              <Typography>Simply input your text and let our software do some magic by creating you flashcards in an instant.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={boxStyle}>
              <Typography variant="h6" gutterBottom>Smart Flashcards</Typography>
              <Typography>Our AI intellgently breaks down your text into targeted flashcards making them a game changer when studying.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={boxStyle}>
              <Typography variant="h6" gutterBottom>Accessible from any device</Typography>
              <Typography>Access your flashcards from anywhere, any place, any time.</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={boxStyle}>
              <Typography variant="h5" gutterBottom>Basic</Typography>
              <Typography variant="h6" gutterBottom>$5 / Month</Typography>
              <Typography>Access to basic flashcard features and limited storage.</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmitBasic}>Choose Basic</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={boxStyle}>
              <Typography variant="h5" gutterBottom>Pro</Typography>
              <Typography variant="h6" gutterBottom>$10 / Month</Typography>
              <Typography>Unlimted flashcards and storage, with priority support.</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmitPro}>Choose Pro</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
