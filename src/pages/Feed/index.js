import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';

import api from '../../api';
import { Post, Name, Header, Avatar, PostImage, Description } from './styles';

export default function Feed() {
    const [feed, setFeed] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    async function loadPage(pageNumber = page, shouldRefresh) {

        const response = await fetch(`http://${api}:3000/feed?_expand=author&_limit=5&_page=${pageNumber}`);
        const data = await response.json();
        const totalItems = response.headers.get('X-Total-Count');

        //setTotal(Math.floor(totalItems / 5))
        setFeed([...feed, ...data]);
        if (pageNumber > 3)
            setPage(1);
        else
            setPage(page + 1)
    }

    useEffect(() => {

        loadPage();
    }, []);

    return (
        <View>
            <FlatList
                data={feed}
                keyExtractor={post => String(post.id + Math.random()) }
                onEndReached={() => loadPage()}
                onEndReachedThreshold={0.1}
                renderItem={({ item }) => (
                    <Post>
                        <Header>
                            <Avatar source={{ uri: item.author.avatar }} />
                            <Name>{item.author.name}</Name>
                        </Header>

                        <PostImage ratio={item.aspectRatio} source={{ uri: item.image }} />

                        <Description>
                            <Name>{item.author.name}</Name> {item.description}
                        </Description>
                    </Post>
                )}
            />
        </View>
    );
}
