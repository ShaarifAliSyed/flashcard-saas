'use client'
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useRouter } from "next/navigation"
import { CardActionArea, CardContent, Container, Grid, Typography, Card, AppBar, Toolbar, Link, Button } from "@mui/material"

export default function Flashcards() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return
            // Make sure user is signed in here! Otherwise it will not work
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            } else {
                await setDoc(docRef, {flashcards: []})
            }
        }
        getFlashcards()
    }, [user])

    if (!isLoaded && !isSignedIn) {
        return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }

    return(<Container maxWidth={false} disableGutters>

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

        <Typography variant="h4" sx={{flexGrow: 1, textAlign: "center", mt: 4}}>
                View Flashcard Collections
        </Typography>
        <Grid container spacing = {3} sx = {{
            mt: 2,
            textAlign: "center"
        }}>
            {flashcards.map((flashcard, index) => (
                <Grid item xs = {12} sm = {6} md = {4} key = {index}>
                    <Card>
                        <CardActionArea 
                            onClick={() => {
                                handleCardClick(flashcard.name)
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6">{flashcard.name}</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>
    </Container>)
}