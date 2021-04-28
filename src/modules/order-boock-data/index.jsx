import React, {Component} from 'react';
import './style.scss'

class OrderBookData extends Component {
  state = {
      data: [],
      count:100
  };

  componentDidMount() {
      window.addEventListener('scroll', this.infiniteScroll);
      this.webSocket();
  }

  webSocket = () => {
    const getSymbols = {
        "jsonrpc": "2.0",
        "id": 0,
        "method": "eth_getLogs",
        "params": []
    };

    const ws = new WebSocket('wss://mainnet.infura.io/ws/v3/f2ebb578962d48c8ac44f1898b330630');
    ws.onopen = () => {
      ws.send(JSON.stringify(getSymbols));
    };
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      let data;
      if(this.state.data.length > 0){
          data = this.state.data;
          data = data.concat(response.result);
            } else {
          data = response.result
      }
        this.setState({
            data: data
        });
    };

    ws.onclose = () => {
      ws.close();
    };
  };

    infiniteScroll = () => {
        // End of the document reached?
        if (document.documentElement.clientHeight  + document.documentElement.scrollTop
            >= document.documentElement.scrollHeight-5){

            let count = this.state.count;
            count = count + 10;
            this.setState({
                count: count
            });

            if(this.state.count >= this.state.data.length) {
                this.webSocket();
            } else {
                this.getData();
            }
        }
    };

  // return  new data array
  getData = () => {
    const {data} = this.state;
    return data.slice(0, this.state.count)
  };


  render() {
    return (
        <div className="G-container">
            <div className='P-table-header'>
              <ul className='G-flex'>
                <li>Address</li>
                <li>Block Hash</li>
                <li>Block Number</li>
              </ul>
            </div>
            <div className='P-table-body'>
              {this.getData().map((item, index) => {
                return <ul key={index} className='G-flex'>
                  <li>{item.address  || '—'}</li>
                  <li>{item.blockHash  || '—'}</li>
                  <li>{item.blockNumber || '—'}</li>
                </ul>
              })}
            </div>
        </div>
    );
  }
}

export default OrderBookData;
