import React from 'react';
import { FlatList, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { styles } from './theme';
import BrandHeader from './BrandHeader';

const logo = require('../assets/logo-sonora.png');

function AlbumCard({ album, onPress }) {
  return (
    <Pressable style={styles.albumCard} onPress={onPress}>
      <View style={styles.albumCardTop}>
        <View style={styles.cover}>
          {album.coverImage
            ? <Image source={{ uri: album.coverImage }} style={styles.coverImage} />
            : <Text style={styles.coverText}>♫</Text>}
        </View>
        <View style={styles.albumCardInfo}>
          <Text style={styles.albumTitle}>{album.title}</Text>
          <Text style={styles.albumArtist}>{album.artist}</Text>
        </View>
      </View>
      <View style={styles.tags}>
        <View style={styles.tag}><Text style={styles.tagText}>{album.genre}</Text></View>
        <View style={styles.tag}><Text style={styles.tagText}>{album.year}</Text></View>
      </View>
      <Text style={styles.trackCount}>
        {album.songs.length} {album.songs.length === 1 ? 'faixa' : 'faixas'}
      </Text>
    </Pressable>
  );
}

export default function AlbumList({ albums, home, onOpenLibrary, onAdd, onSelect, onHome }) {
  if (home) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.homeContent}>
        <View style={styles.homeTopBar}>
          <BrandHeader />
          <Text style={styles.homeGreeting}>SUA BIBLIOTECA MUSICAL</Text>
        </View>
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />
          <Text style={styles.heroEyebrow}>Sua trilha, do seu jeito</Text>
          <Text style={styles.heroTitle}>Música boa{'\n'}mora aqui.</Text>
          <Text style={styles.heroDescription}>
            Organize seus álbuns e deixe cada lembrança no ritmo certo.
          </Text>
          <Pressable style={styles.button} onPress={onOpenLibrary}>
            <Text style={styles.buttonText}>Abrir minha biblioteca</Text>
          </Pressable>
          <Text style={styles.heroNote}>
            {albums.length} {albums.length === 1 ? 'álbum na coleção' : 'álbuns na coleção'}
          </Text>
          <Text style={styles.heroMusicNote}>♫</Text>
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Adicionados recentemente</Text>
          <Pressable onPress={onOpenLibrary}><Text style={styles.textLink}>Ver biblioteca</Text></Pressable>
        </View>
        {albums.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Sua coleção começa aqui</Text>
            <Text style={styles.emptyText}>Adicione um álbum para organizar suas músicas.</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentAlbums}>
            {albums.slice(0, 5).map((album) => (
              <Pressable key={album.id} style={styles.recentAlbum} onPress={() => onSelect(album)}>
                <View style={styles.recentCover}>
                  {album.coverImage
                    ? <Image source={{ uri: album.coverImage }} style={styles.coverImage} />
                    : <Image source={logo} style={styles.recentCoverLogo} />}
                </View>
                <Text style={styles.recentAlbumTitle} numberOfLines={1}>{album.title}</Text>
                <Text style={styles.recentAlbumArtist} numberOfLines={1}>{album.artist}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
        <Text style={[styles.sectionTitle, styles.categoryHeading]}>Explore por gênero</Text>
        <View style={styles.categoryList}>
          {['Pop', 'Rock', 'MPB', 'Indie', 'Eletrônica'].map((genre) => (
            <View key={genre} style={styles.categoryChip}>
              <Text style={styles.categoryChipText}>{genre}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={albums}
        keyExtractor={(album) => album.id}
        renderItem={({ item }) => <AlbumCard album={item} onPress={() => onSelect(item)} />}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={(
          <View style={styles.header}>
            <BrandHeader />
            <Pressable onPress={onHome} hitSlop={10}>
              <Text style={styles.backLink}>‹ Início</Text>
            </Pressable>
            <Text style={styles.title}>Meus álbuns</Text>
            <Text style={styles.subtitle}>Sua coleção, artista por artista.</Text>
            <View style={styles.libraryToolbar}>
              <Text style={styles.libraryCount}>{albums.length} {albums.length === 1 ? 'álbum' : 'álbuns'}</Text>
              <Pressable style={styles.buttonCompact} onPress={onAdd}>
                <Text style={styles.buttonText}>＋ Adicionar álbum</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={(
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>♫</Text>
            <Text style={styles.emptyTitle}>Sua coleção começa aqui</Text>
            <Text style={styles.emptyText}>Adicione um álbum para começar a organizar suas músicas.</Text>
          </View>
        )}
      />
    </View>
  );
}
