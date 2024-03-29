import './Gameroom.scss';

import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';

import ChatWindow from '../../Components/ChatWindow/ChatWindow';
import ChatInput from '../../Components/ChatInput/ChatInput';
import { IMessageProps } from '../../Components/Message/Message'
import Board, { IBoardProps } from '../../Components/Board/Board';
import Toolbar from '../../Components/Toolbar/Toolbar';
import Card from '../../Components/Card/Card';

import Tabs, {ITabViewerProps, ITabPaneProps} from '../../Components/Tabs/Tabs';
import PanelView from '../../Components/PanelView/PanelView';
import useToken from '../../Utils/useToken';

export interface IGameroomProps
{

}

function Gameroom(props: IGameroomProps) {
    const { token } = useToken();
    const [ connection, setConnection ] = useState<HubConnection | null>(null);
    const [ chat, setChat ] = useState<Array<IMessageProps>>(new Array<IMessageProps>());
    const [ board, setBoard ] = useState<IBoardProps>({ cells: [] });
    const [ panel, setPanel ] = useState<ITabViewerProps>();
    const [ tools, setTools ] = useState([]);
    const [ username, setUsername ] = useState(String);
    const latestChat = useRef<Array<IMessageProps>>(new Array<IMessageProps>);

    latestChat.current = chat;

    fetch('http://localhost:5191/powerfantasy/username/'+ token)
    .then(response => response.json())
    .then(data => {
        setUsername(data.username);
    })
    .catch(error => {
        console.error(error);
        setUsername("error");    
    });

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:5191/hubs/powerfantasy', )
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('Connected!');

                    connection.on('ReceivePanel', (PanelTVProps: ITabViewerProps) => {
                        console.log(PanelTVProps);
                        let tabsWithReactObjectChildren = new Array<ITabPaneProps>;
                        PanelTVProps.tabs.map((tab) => {
                            tab.children = new Toolbar(tab.children);
                            tabsWithReactObjectChildren.push(tab);
                        })
                        PanelTVProps.tabs = tabsWithReactObjectChildren;
                        let updatedPanel = PanelTVProps;
                        setPanel(updatedPanel);
                    });

                    connection.on('ReceiveBoard', (BoardProps: IBoardProps) => {
                        console.log(BoardProps);
                        setBoard(BoardProps);
                    });
    
                    connection.on('ReceiveMessage', message => {
                        const updatedChat = [...latestChat.current];
                        updatedChat.push(message);
                    
                        setChat(updatedChat);
                        // after updating chat make sure that if the scrollbar is close enough to the end, it'll automatically slide down to show new messages
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const sendMessage = async (user: string, message: string) => {
        const chatMessage = {
            user: user,
            message: message
        };

        try {
            await  fetch('http://localhost:5191/powerfantasy/messages', { 
                method: 'POST', 
                body: JSON.stringify(chatMessage),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        catch(e) {
            console.log('Sending message failed.', e);
        }
    }

    const clearChat = () => {
        setChat([]);
    }

    /* BAGUNÇA ABAIXO */
    var testBoardRendering = [
        [
            {
                occupied: true,
                tokenPicId: "token_1.png"
            }
        ]
    ]

    const panelTestContent = [
        {
            selectorTitle: 'titleA',
            text: 'a'
        },
        {
            selectorTitle: 'titleB',
            text: 'b'
        }
    ]

    const toolbarTabTitles = [
        "Character",
        "Hand",
        "Game Master"
    ]

    const panelTabTitles = [
        "Self",
        "Target"
    ]

    const panelId = "panel";
    
    var testTools = {
        toolbuttons: ["attacks", "spells", "skills", "saving throws", "inventory"]
    }
    var testTools2 = {
        toolbuttons: ["Add token", "test"]
    }
    var testTools3 = {
        toolbuttons: ["New map", "new layer", "pull players"]
    }


    const tokenPropsTest1 = [
        {
            name: "Health Points",
            value: 19
        },
        {
            name: "Armor Class",
            value: 10
        }
    ]

    const tokenPropsTest = [
        {
            name: "Health Points",
            value: 20
        },
        {
            name: "Armor Class",
            value: 13
        }
    ]

    var testPanel1 = {
        tokenPicId: "token_1.png",
        tokenProps: tokenPropsTest,
        pvId: "pv1"
    }

    var testPanel2 = {
        tokenPicId: "token_1.png",
        tokenProps: tokenPropsTest1,
        pvId: "pv2"
    }

    const multiplePanelsTest = [
        new PanelView(testPanel1),
        new PanelView(testPanel2)
    ]

    const chatInputProps = {
        'sendMessage': sendMessage
    }

    

    /* BAGUNÇA ACIMA */

    return (
      <div className="base-structure">
        <div className='game'>
            <Board {...board}/>
        </div>
        <Card className="panel bg-color-white-chocolate">
            
        </Card>
        <div className="tools">
            {panel == null ? <></> : <Tabs {...panel!} />}
        </div>
        <Card className='chat bg-color-white-chocolate'>
            <ChatWindow chat={chat}/>
            <ChatInput sendMessage={sendMessage} username={username}/>
            <button onClick={clearChat}>Clear</button>
        </Card>
      </div>
    );
}

export default Gameroom;
