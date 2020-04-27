package main

import (
	"fmt"
	"time"

	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
)

func packets() {
	if handle, err := pcap.OpenLive("wlp1s0", 1600, true, pcap.BlockForever); err != nil {
		panic(err)
	} else if err := handle.SetBPFFilter("tcp and port 22"); err != nil { // optional
		panic(err)
	} else {
		packetSource := gopacket.NewPacketSource(handle, handle.LinkType())
		for packet := range packetSource.Packets() {
			tcpInfo := packet.Layer(layers.LayerTypeTCP).(*layers.TCP)

			if tcpInfo.SrcPort == 22 {
				fmt.Println("Packet goroutine| SSH FOUND!")
			}
			//fmt.Println(tcpInfo.SrcPort)
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
