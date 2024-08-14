import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Container, Toolbar, Typography, Button, Box, Grid } from "@mui/material";
// import Head from "next/head";

// migration to Metadata API for newer versions of Next.js recommends this method, instead of using - import Head from "next/head";
export const metadata = {
  title: 'Flashcard SaaS',
  description: 'Create Flashcard from your text',
};

export default function Home() {
  return (
    // disableGutters prop on the Container component removes the default padding and allows the component to cover the full width of the screen
    <Container maxWidth={false} disableGutters>
      {/* <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create Flashcard from your text"/>
      </Head> */}

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1}}>Flashcard SaaS</Typography>
          <SignedOut>
            <Button color="inherit">Login</Button>
            <Button color="inherit">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{
        textAlign: 'center',
        my: 4
      }}>
        <Typography variant="h2">Welcome to Flashcard SaaS</Typography>
        <Typography variant="h5">The easiest way to make flashcards from your text</Typography>
        <Button variant="contained" color="primary" sx={{mt: 2}}>Get Started</Button>
      </Box>


      <Box sx={{my: 6, textAlign: 'center'}}>
        <Typography variant="h4" gutterBottom>Features</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Easy Text Input</Typography>
            <Typography>Simply input your text and let our software do some magic by creating you flashcards in an instant.</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Smart Flashcards</Typography>
            <Typography>Our AI intellgently breaks down your text into targeted flashcards making them a game changer when studying.</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Accessible from any device</Typography>
            <Typography>Access your flashcards from anywhere, any place, any time.</Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{my: 6, textAlign: 'center'}}>
        <Typography variant="h4" gutterBottom>Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2
            }}>
              <Typography variant="h5" gutterBottom>Basic</Typography>
              <Typography variant="h6" gutterBottom>$5 / Month</Typography>
              <Typography>Access to basic flashcard features and limited storage.</Typography>
              <Button variant="contained" color="primary" sx={{mt: 2}}>Choose Basic</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2
            }}>
              <Typography variant="h5" gutterBottom>Pro</Typography>
              <Typography variant="h6" gutterBottom>$10 / Month</Typography>
              <Typography>Unlimted flashcards and storage, with priority support.</Typography>
              <Button variant="contained" color="primary" sx={{mt: 2}}>Choose Basic</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
