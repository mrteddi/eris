package main

import (
	"fmt"
	"strconv"
	"time"

	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
)

func packets() {

	// Building the filter string to check for wanted ports
	ports := []int{21, 22}
	filterStr := "tcp and ("
	for i, p := range ports {
		p := strconv.Itoa(p)
		if i != len(ports)-1 {
			filterStr += "port " + string(p) + " or "
		} else {
			filterStr += "port " + string(p)
		}

	}
	filterStr += ")"

	if handle, err := pcap.OpenLive("wlp1s0", 1600, true, pcap.BlockForever); err != nil {
		// Start pcap capture on the wireless interface
		panic(err)
	} else if err := handle.SetBPFFilter(filterStr); err != nil {
		// Sets filter to capture on, panic if any error
		panic(err)
	} else {
		packetSource := gopacket.NewPacketSource(handle, handle.LinkType())
		for packet := range packetSource.Packets() {
			// Get the TCP layer from the captured packet
			tcpInfo := packet.Layer(layers.LayerTypeTCP).(*layers.TCP)

			// Check for matching ports
			for _, p := range ports {
				if tcpInfo.SrcPort == layers.TCPPort(p) {
					fmt.Printf("Packet goroutine| Port %d found!\n", p)
				}
			}
		}
	}
}

func files() {
	for i := 0; i < 100; i++ {
		time.Sleep(400 * time.Millisecond)
		fmt.Println("File goroutine|" + string(i))
	}
}

func main() {
	go packets()
	go files()

	for true {
	}
}
