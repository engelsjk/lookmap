package main

import (
	"flag"
	"log"
	"net"
	"net/http"
	"os"

	"github.com/engelsjk/lookmap/socket"
)

func main() {

	port := os.Getenv("PORT")

	if port == "" {
		log.Fatal("$PORT must be set")
	}

	flag.Parse()

	hub := socket.NewHub()

	go hub.Run()

	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		socket.ServeWs(hub, w, r)
	})

	log.Printf("running at :%s...", port)

	err := http.ListenAndServe(net.JoinHostPort("", port), nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
