import { NextRequest, NextResponse } from "next/server";

import admin from "firebase-admin";
import { adminDb } from "@/lib/firebaseAdmin";

// **Middleware untuk autentikasi**
async function verifyUser(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
        throw new Error("Unauthorized");
    }

    const token = authHeader.split("Bearer ")[1];
    if (!token) {
        throw new Error("Invalid token");
    }

    // Verifikasi token dengan Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken.uid; // ID user yang sedang login
}

// **UPDATE NOTE**
export async function PUT(
    req: NextRequest, 
) {
    try {
        const uid = await verifyUser(req); // Verifikasi pengguna
        const pathParts = req.nextUrl.pathname.split("/"); // Ambil path sebagai array
        const noteId = pathParts[pathParts.length - 1];
        const { title, text } = await req.json();

        if (!title || !text || !noteId) {
            return NextResponse.json({ error: "Title and text are required" }, { status: 400 });
        }

        const noteRef = adminDb.collection("users").doc(uid).collection("notes").doc(noteId);
        const noteSnap = await noteRef.get();

        if (!noteSnap.exists) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        await noteRef.update({
            title,
            text,
            updatedAt: new Date().toISOString(),
        });

        return NextResponse.json({ message: "Note updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating note:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// **DELETE NOTE**
export async function DELETE(
    req: NextRequest, 
) {
    try {
        const uid = await verifyUser(req); // Verifikasi pengguna
        const pathParts = req.nextUrl.pathname.split("/"); // Ambil path sebagai array
        const noteId = pathParts[pathParts.length - 1];

        if (!noteId) {
            return NextResponse.json({ error: "note id not found", message: noteId }, { status: 404 });
        }

        const noteRef = adminDb.collection("users").doc(uid).collection("notes").doc(noteId);
        const noteSnap = await noteRef.get();

        if (!noteSnap.exists) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        await noteRef.delete();

        return NextResponse.json({ message: "Note deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting note:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
