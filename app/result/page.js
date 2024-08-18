'use client'
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import getStripe from "@/utils/get-stripe"
import { CircularProgress, Container, Typography, Box } from "@mui/material"

const ResultPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')

    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if (!session_id) return

            try {
                const res = await fetch(`/api/checkout_session_basic?session_id=${session_id}`)
                const sessionDataBasic = await res.json()
                if (res.ok) {
                    setSession(sessionDataBasic)
                } else if (res.status === 404) {
                    const res = await fetch(`/api/checkout_session_pro?session_id=${session_id}`)
                    const sessionDataPro = await res.json()

                    if (res.ok) {
                        setSession(sessionDataPro)
                    } else {
                        setError(sessionDataPro.error)
                    }
                } else {
                    setError(sessionDataBasic.error)
                }
            }
            catch (err) {
                setError('An Error Occured')
            }
            finally {
                setLoading(false)
            }
        }

        fetchCheckoutSession()
    }, [session_id])

    if (loading) {
        return(
            <Container maxWidth = "100vw" sx = {{
                textAlign: "center",
                mt: 4
            }}>
                <CircularProgress/>
                <Typography variant="h6">Loading...</Typography>
            </Container>
        )
    }

    if (error) {
        return(
            <Container maxWidth = "100vw" sx = {{
                textAlign: "center",
                mt: 4
            }}>
                <Typography variant="h6">{error}</Typography>
            </Container>
        )
    }

    return(
        <Container maxWidth = "100vw" sx = {{
            textAlign: "center",
            mt: 4
        }}>
            {session.payment_status === "paid" ? (
                    <>
                        <Typography variant="h4">Thank you for Purchasing!</Typography>
                        <Box sx = {{mt: 22}}>
                            <Typography variant="h6">Session ID: {session_id}</Typography>
                            <Typography variant="body1">
                                We have recieved your payment. You will receive an email with your order details shortly.
                            </Typography>
                        </Box>
                    </>
            ) : (
                <>
                        <Typography variant="h4">Payment Failed</Typography>
                        <Box sx = {{mt: 22}}>
                            {/* <Typography variant="h6">Session ID: {session_id}</Typography> */}
                            <Typography variant="body1">
                                Your payment was not successful. Please try again.
                            </Typography>
                        </Box>
                    </>
            )}
        </Container>
    ) 
}



export default ResultPage