import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
export async function POST(req) {
    const { userId, status, endDate } = await req.json();

    try {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, {
            subscriptionStatus: status,
            subscriptionEndDate: endDate
        });

        return new Response(JSON.stringify({ message: 'Subscription updated successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error updating subscription:', error);
        return new Response(JSON.stringify({ error: 'Failed to update subscription' }), { status: 500 });
    }
}
