import React, { Component } from "react";

// antd components
import { Layout, Drawer} from 'antd';
import Block from 'react-blocks';

const { Content, Header } = Layout;



export default class AllHistory extends Component {

    showDrawer = (id) => {
      this.setState({
        visible: true,
        drawer: this.props.items.filter(history => history.id == id) && this.props.items.filter(history => history.id == id)[0]
      });
    };
    
    onClose = () => {
      this.setState({
        visible: false,
      });
    };

    constructor(props) {
        super(props);

        this.state = { 
          visible: false,
          drawer: this.props.items[0]
        };
    }
    
    componentWillMount(){
        this.props.subscribeToNewHistory();
    }

    static defaultProps = {
        items: []
    }
    
    convertTime = (time) => {
      var d = new Date(0)
      d.setSeconds(time)
      return d.toString()
    }

    render() {
        const { items } = this.props
        const { drawer } = this.state
        const currentItem = items && items[0]
        console.log(this.props)

        return (
            <Layout>
            <Header>
                <img className="logoicon" src="https://a0.awsstatic.com/libra-css/images/logos/aws_smile-header-desktop-en-white_59x35.png"/>
                <span className="logo">AWS Deeplens - 人脸识别</span>
            </Header>
            <Content>
                <Block layout>
                  <Block className="sidebar" layout verticali style={{width: "40%"}}>
                    <Block className="video">
                        {/* <img src="https://images.pexels.com/photos/370799/pexels-photo-370799.jpeg?cs=srgb&dl=light-art-blue-370799.jpg&fm=jpg"/> */}
                        <img data-reactroot="" src="https://192.168.1.137:4000/video_feed_proj"/>
                    </Block>
                    <Block className="history" >
                        
                        {items.map(item => 
                            <div className="list" onClick={() => this.showDrawer(item.id)}>
                              <span class="ant-avatar ant-avatar-lg ant-avatar-circle ant-avatar-image">
                                <img className="avatar" alt={item.name} src={item.live_photo_url} />
                              </span>
                              <span><b>{this.convertTime(item.visit_time)}</b></span>
                            </div>
                        )}
                        
                        {drawer && <Drawer
                          title=""
                          width={720}
                          placement="right"
                          onClose={this.onClose}
                          maskClosable={true}
                          visible={this.state.visible}
                          style={{
                            height: 'calc(100% - 55px)',
                            overflow: 'auto',
                            paddingBottom: 53,
                          }}
                        >
                          <img src={drawer.live_photo_url}/>
                          <br/><b>来访者</b>：{drawer.name}
                          <br/><b>到访时间</b>: {this.convertTime(drawer.visit_time)}
                        </Drawer>}
                    </Block>
                    
                  </Block>
                  <Block className="content" layout reverse >
                    {
                        currentItem && 
                        <img className="resume" src={currentItem.resume_photo_url}/>
                    }
                    
                  </Block>
                </Block>
            </Content>
            </Layout>

        );
    }
}