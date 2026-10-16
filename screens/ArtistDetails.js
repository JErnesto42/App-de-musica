import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { styles } from './theme';
import BrandHeader from './BrandHeader';

export default function ArtistDetails({ artist, albums, onBack, onSelectAlbum, onSelectSong }) {
  const genres = [...new Set(albums.map((album) => album.genre).filter(Boolean))];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <BrandHeader />
      <Pressable onPress={onBack} hitSlop={10} style={{ marginBottom: 18 }}>
        <Text style={styles.backLink}>‹ Voltar para artistas</Text>
      </Pressable>

      <View style={styles.artistProfile}>
        <View style={styles.artistProfileAvatar}><Text style={styles.artistProfileIcon}>♫</Text></View>
        <Text style={styles.title}>{artist}</Text>
        <View style={styles.artistGenres}>
          {genres.map((genre) => (
            <View key={genre} style={styles.tag}><Text style={styles.tagText}>{genre}</Text></View>
          ))}
        </View>
        <Text style={styles.subtitle}>
          {albums.length} {albums.length === 1 ? 'álbum' : 'álbuns'} na coleção
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Álbuns e músicas</Text>
      {albums.map((album) => (
        <View key={album.id} style={styles.artistAlbumCard}>
          <Pressable
            accessibilityRole="button"
            onPress={() => onSelectAlbum(album)}
            style={styles.artistAlbumHeader}
          >
            <View style={styles.cover}>
              {album.coverImage
                ? <Image source={{ uri: album.coverImage }} style={styles.coverImage} />
                : <Text style={styles.coverText}>♫</Text>}
            </View>
            <View style={styles.albumCardInfo}>
              <Text style={styles.albumTitle}>{album.title}</Text>
              <Text style={styles.albumArtist}>{album.year}</Text>
              <View style={styles.artistGenres}>
                <View style={styles.tag}><Text style={styles.tagText}>{album.genre}</Text></View>
              </View>
            </View>
            <Text style={styles.artistChevron}>›</Text>
          </Pressable>
          {(album.songs ?? []).map((song, index) => (
            <Pressable
              key={song.id}
              accessibilityRole="button"
              onPress={() => onSelectSong(album, song)}
              style={styles.artistTrack}
            >
              <Text style={styles.trackNumber}>{String(index + 1).padStart(2, '0')}</Text>
              <Text style={styles.trackTitle}>{song.title}</Text>
              <Text style={styles.trackDuration}>{song.duration}</Text>
            </Pressable>
          ))}
          {album.songs?.length === 0 ? (
            <Text style={styles.artistAlbumEmpty}>Ainda não há músicas neste álbum.</Text>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}
