'use client'
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { db } from "@/firebase"
import { Container, Paper, TextField, Typography, Box, Button, Grid, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Card, CircularProgress, Link, AppBar, Toolbar } from "@mui/material"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { doc, collection, setDoc, getDoc, writeBatch } from "firebase/firestore"

export default function Generate() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async () => {
        setLoading(true); // Start loading as soon as the button is clicked
    
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                body: text
            });
    
            const data = await res.json();
            setFlashcards(data); // Update flashcards state
            setLoading(false); // Stop loading after flashcards are set
            setText(''); // Clear input textfield
        } catch (error) {
            console.error('Error generating flashcards:', error);
            setLoading(false); // Stop loading in case of an error
        }
    };

    // const handleSubmit = async () => {
    //     fetch('/api/generate', {
    //         method: 'POST',
    //         body: text
    //     })
    //     .then((res) => res.json())
    //     .then((data) => 
    //         setFlashcards(data)
    //     )
    //     setText('') // clear input textfield
    // }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name')
            return
        }

        const batch = writeBatch(db)
        // Make sure user is signed in here! Otherwise it will not work
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)) {
                alert("Flashcard collection with the same name already exists.")
                return
            } else {
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }
        } else {
            batch.set(userDocRef, {flashcards: [{name}]})
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard) // Using batch as we do not want to write everything one by one, instead we write them all at once (saves API costs)
        })

        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }

    return <Container maxWidth={false} disableGutters>

        <AppBar position="static">
            <Toolbar>
                <Link href="/" passHref style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
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

        <Box sx = {{
            mt: 4, 
            mb: 6, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center'
        }}
        >
            <Typography variant="h4" style={{flexGrow: 1}}>
                Generate Flashcards
            </Typography>
            <Paper sx = {{p: 4, width: '100%'}}>
                <TextField 
                    value = {text} 
                    onChange={(e) => setText(e.target.value)} 
                    label = "Enter text"
                    fullWidth
                    multiline
                    rows = {4}
                    variant="outlined"
                    sx = {{
                        mb: 2
                    }}
                />
                <Button 
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    fullWidth
                >
                    Submit
                </Button>
            </Paper>
        </Box>

        {/* Circular Loading Indicator */}
        {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress />
            </Box>
        )}

        {flashcards.length > 0 && (
            <Box sx = {{mt: 4}}>
            <Typography variant="h5">Flashcards Preview</Typography>
            <Grid container spacing = {3}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardActionArea onClick={() => {
                                handleCardClick(index)
                            }}>
                                <CardContent>
                                    <Box sx = {{
                                        perspective: '1000px',
                                        '& > div': {
                                            transition: 'transform 0.6s',
                                            transformStyle: 'preserve-3d',
                                            position: 'relative',
                                            width: '100%',
                                            height: '200px',
                                            boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.2)',
                                            transform: flipped[index]
                                                ? 'rotateY(180deg)'
                                                : 'rotateY(0deg)'
                                        },
                                        '& > div > div': {
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            backfaceVisibility: 'hidden',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: 2,
                                            boxSizing: 'border-box'
                                        },
                                        '& > div > div:nth-of-type(2)': {
                                            transform: 'rotateY(180deg)',
                                        }
                                    }}>
                                        <div>
                                            <div>
                                                <Typography variant="h5" component="div">
                                                    {flashcard.front}
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography variant="h5" component="div">
                                                    {flashcard.back}
                                                </Typography>
                                            </div>
                                        </div>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box sx = {{mt: 4, display: 'flex', justifyContent: 'center'}}>
                <Button variant='contained' color='secondary' onClick={handleOpen}>
                    Save
                </Button>
            </Box>
        </Box>
        )}

        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Save Flashcards</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter a name for your flashcards collection
                </DialogContentText>
                <TextField 
                    autoFocus 
                    margin="dense" 
                    label="Collection Name" 
                    type="text" 
                    fullWidth 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    variant="outlined"/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={saveFlashcards}>Save</Button>
            </DialogActions>
        </Dialog>
    </Container>
} 
