package main

import (
    "context"
    "os"

    "github.com/clerk/clerk-sdk-go/v2"
)

var clerkClient *clerk.Client

func initClerk() error {
    secretKey := os.Getenv("CLERK_SECRET_KEY")
    if secretKey == "" {
        return fmt.Errorf("CLERK_SECRET_KEY not set")
    }
    client, err := clerk.NewClient(secretKey)
    if err != nil {
        return err
    }
    clerkClient = client
    return nil
}

// Use this to get the client in other parts
func getClerkClient() *clerk.Client {
    return clerkClient
}
