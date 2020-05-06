package main

import (
	"bytes"
	"daemon/erisconfig"
	"encoding/json"
	"fmt"
	"net/http"
	"os/exec"
	"strconv"
	"strings"
	"time"

	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
)

type Message struct {
	Name string
	Type string
	Body string
}

func sendInfo(reqB Message) {

	req, err := json.Marshal(reqB)

	// fmt.Println(string(req))

	resp, err := http.Post("http://10.0.0.206:5000/api/receiveDaemon", "application/json", bytes.NewBuffer(req))

	if err != nil {
		fmt.Println("failed")
	} else {
		fmt.Println("erisClient sent: " + string(req))
	}

	// fmt.Println(resp)

	defer resp.Body.Close()
}

func removeIndex(arr interface{}, i int) interface{} {

	switch o := arr.(type) {
	case []int:
		arr := o
		arr[i] = arr[len(arr)-1]
		arr[len(arr)-1] = 0
		arr = arr[:len(arr)-1]
		return arr
	case []string:
		arr := o
		arr[i] = arr[len(arr)-1]
		arr[len(arr)-1] = ""
		arr = arr[:len(arr)-1]
		return arr
	default:
		return arr
	}

}

func packets() {

	// Building the filter string to check for wanted ports
	//ports := []int{21, 22}
	ports := erisconfig.Ports
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

	fmt.Println(filterStr)

	if handle, err := pcap.OpenLive(erisconfig.Network, 1600, true, pcap.BlockForever); err != nil {
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
			for i, p := range ports {
				if tcpInfo.SrcPort == layers.TCPPort(p) {
					fmt.Printf("Packet goroutine| Port %d found!\n", p)
					ports = removeIndex(ports, i).([]int)
					// fmt.Println(ports)

					req := Message{erisconfig.Name, "port", strconv.Itoa(p)}

					sendInfo(req)
				}
			}
			if len(ports) == 0 {
				fmt.Println("Packet goroutine | returned from goroutine")
				return
			}
		}
	}
}

func files() {
	// files := map[string]string{
	// 	"/home/conor/git/eris/daemon/tmp":  "1588030155",
	// 	"/home/conor/git/eris/daemon/tmp2": "1588031976",
	// }
	files := erisconfig.Files
	for true {
		if len(files) == 0 {
			fmt.Println("Files goroutine | returned from goroutine")
			return
		}
		for file, readTime := range files {
			cmd := exec.Command("stat", "--format", "%X", file)
			stdout, _ := cmd.Output()
			output := strings.TrimSuffix(string(stdout), "\n")

			if output != readTime {
				fmt.Printf("File goroutine | File %s found!\n", file)
				delete(files, file)

				req := Message{erisconfig.Name, "file", file}
				sendInfo(req)
			}
		}
		time.Sleep(2 * time.Second)
	}
}

func main() {
	go packets()
	go files()

	for true {
	}
}
