import { SignIn } from "@clerk/nextjs";
import { AppBar, Button, Container, Typography, Link, Box, Toolbar } from "@mui/material";

export default function SignUpPage() {
    return <Container maxWidth={false} disableGutters>
        <AppBar position="static">
            <Toolbar>
                <Link href="/" passHref style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
                    <Typography variant="h6" style={{flexGrow: 1}}>
                        Flashcard SaaS
                    </Typography>
                </Link>
                <Button color="inherit">
                    <Link href="/sign-in" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                        Login
                    </Link>
                </Button>
                <Button color="inherit">
                    <Link href="/sign-up" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                        Sign Up
                    </Link>
                </Button>
            </Toolbar>
        </AppBar>

        <Box 
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            <Typography variant="h4" sx = {{mt: 2, mb: 2}}>Sign In</Typography>
            <SignIn/>
        </Box>
    </Container>
}