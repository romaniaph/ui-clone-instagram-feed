import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';

import api from '../../api';
import { Post, Name, Header, Avatar, PostImage, Description, Loading } from './styles';

export default function Feed() {
    const [feed, setFeed] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)


    async function loadPage(pageNumber = page, shouldRefresh = false) {

        setLoading(true);

        const response = await fetch(`http://${api}:3000/feed?_expand=author&_limit=5&_page=${pageNumber}`);
        const data = await response.json();
        const totalItems = response.headers.get('X-Total-Count');

        setFeed(shouldRefresh ? data :  [...feed, ...data]);
        if (pageNumber > 3)
            setPage(1);
        else
            setPage(page + 1)

        setLoading(true);

    }

    async function refreshList() {
        setRefreshing(true);

        await loadPage(1, true);

        setRefreshing(false)
    }

    useEffect(() => {

        loadPage();
    }, []);

    return (
        <View>
            <FlatList
                onRefresh={refreshList}
                refreshing={refreshing}
                data={feed}
                keyExtractor={post => String(post.id + Math.random()) }
                onEndReached={() => loadPage()}
                onEndReachedThreshold={0.1}
                ListFooterComponent ={loading && <Loading />}
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
