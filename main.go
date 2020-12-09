package main

import (
	"flag"
	"log"
	"net"
	"net/http"

	"github.com/engelsjk/lookmap/socket"
)

var port = flag.String("port", "8080", "http service port")

func serveMap(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	http.ServeFile(w, r, "web/map.html")
}

func main() {

	flag.Parse()

	hub := socket.NewHub()

	go hub.Run()

	http.HandleFunc("/", serveMap)
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		socket.ServeWs(hub, w, r)
	})

	log.Printf("running at :%s...", *port)

	err := http.ListenAndServe(net.JoinHostPort("", *port), nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
