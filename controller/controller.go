package main

import (
    "context"
    "log"
    "net/http"
    "os/exec"

    "github.com/go-redis/redis/v8"
)

// Controller struct to hold Redis client
type Controller struct {
    rdb *redis.Client
}

// NewController creates a new instance of Controller
func NewController(rdb *redis.Client) *Controller {
    return &Controller{rdb: rdb}
}

// CheckModule checks the health of a module
func (c *Controller) CheckModule(name string, healthCheckFunc func() bool) bool {
    isRunning := healthCheckFunc()
    c.rdb.Set(ctx, name, isRunning, 0) // Store status in Redis
    return isRunning
}

// CheckModules performs health checks for all modules
func (c *Controller) CheckModules() map[string]bool {
    results := make(map[string]bool)
    
    results["frontend"] = c.CheckModule("frontend", c.CheckFrontend)
    results["gateway"] = c.CheckModule("gateway", c.CheckGateway)
    results["database"] = c.CheckModule("database", c.CheckDatabase)

    return results
}

// CheckAndUpdateModules checks and updates the status of the modules
func (c *Controller) CheckAndUpdateModules() {
    status := c.CheckModules()
    log.Printf("Module Status: %+v\n", status)
}

// Health check function for frontend
func (c *Controller) CheckFrontend() bool {
    resp, err := http.Get("http://localhost:3000/health") // Adjust the URL to your frontend health endpoint
    if err != nil || resp.StatusCode != http.StatusOK {
        return false
    }
    return true
}

// Health check function for gateway
func (c *Controller) CheckGateway() bool {
    resp, err := http.Get("http://localhost:8000/health") // Adjust the URL to your gateway health endpoint
    if err != nil || resp.StatusCode != http.StatusOK {
        return false
    }
    return true
}

// Health check function for database
func (c *Controller) CheckDatabase() bool {
    cmd := exec.Command("pg_isready", "-h", "localhost", "-p", "5432") // Adjust as necessary
    err := cmd.Run()
    return err == nil
}
