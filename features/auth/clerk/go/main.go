package main

import (
    "context"
    "fmt"
    "log"
    "net/http"

    "github.com/clerk/clerk-sdk-go/v2"
    clerkhttp "github.com/clerk/clerk-sdk-go/v2/http"
    "github.com/clerk/clerk-sdk-go/v2/organization"
    "github.com/clerk/clerk-sdk-go/v2/organizationmembership"
    "github.com/clerk/clerk-sdk-go/v2/user"
)

func main() {
    // initialize Clerk
    if err := initClerk(); err != nil {
        log.Fatalf("failed to init Clerk: %v", err)
    }

    ctx := context.Background()

    // Example: create an organization
    org, err := organization.Create(ctx, &organization.CreateParams{
        Name: clerk.String("My Org Name"),
    })
    if err != nil {
        log.Fatalf("organization create failed: %v", err)
    }
    fmt.Printf("Created organization: %+v\n", org)

    // Update organization slug
    updated, err := organization.Update(ctx, org.ID, &organization.UpdateParams{
        Slug: clerk.String("my-org-slug"),
    })
    if err != nil {
        log.Fatalf("organization update failed: %v", err)
    }
    fmt.Printf("Updated org slug: %+v\n", updated)

    // List org memberships
    listParams := organizationmembership.ListParams{
        Limit: clerk.Int64(10),
    }
    memberships, err := organizationmembership.List(ctx, &listParams)
    if err != nil {
        log.Fatalf("list memberships failed: %v", err)
    }
    if len(memberships) > 0 {
        m := memberships[0]
        // fetch user details
        usr, err := user.Get(ctx, m.UserID)
        if err != nil {
            log.Fatalf("user.Get failed: %v", err)
        }
        fmt.Printf("User from membership: %+v\n", usr)
    }

    // HTTP server with a protected endpoint
    mux := http.NewServeMux()
    mux.HandleFunc("/public", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("This is public"))
    })
    // Protected route
    protected := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        claims, ok := clerk.SessionClaimsFromContext(r.Context())
        if !ok {
            w.WriteHeader(http.StatusUnauthorized)
            w.Write([]byte("No valid session"))
            return
        }
        w.Write([]byte(fmt.Sprintf("Hello user %s", claims.Subject)))
    })

    // Wrap with authorization middleware (checks header bearer token)
    mux.Handle("/protected", clerkhttp.RequireHeaderAuthorization()(protected))

    addr := ":8080"
    fmt.Printf("Starting server at %s\n", addr)
    http.ListenAndServe(addr, mux)
}
