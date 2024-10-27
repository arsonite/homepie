package main

import (
    "context"
    "log"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/go-redis/redis/v8"
)

var ctx = context.Background()

func main() {
    rdb := redis.NewClient(&redis.Options{
        Addr: "localhost:6379", // Redis server address
    })

    // Create a new router
    router := gin.Default()

    // Setup health check routes
    router.GET("/health", func(c *gin.Context) {
        controller := NewController(rdb)
        status := controller.CheckModules()
        c.JSON(200, status)
    })

    // Start the health check worker
    go func() {
        controller := NewController(rdb)
        for {
            controller.CheckAndUpdateModules()
            time.Sleep(30 * time.Second) // Check every 30 seconds
        }
    }()

    // Start the server
    if err := router.Run(":8080"); err != nil {
        log.Fatalf("could not run server: %v", err)
    }
}
