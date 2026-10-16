import React from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { styles } from './theme';
import BrandHeader from './BrandHeader';

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

export default function AlbumList({
  albums,
  onAdd,
  onSelect,
  onHome,
  selectedGenre,
  onSelectGenre,
}) {
  const genres = [...new Set(albums.map((album) => album.genre).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
  const filteredAlbums = selectedGenre
    ? albums.filter((album) => album.genre === selectedGenre)
    : albums;

  return (
    <View style={styles.screen}>
      <FlatList
        data={filteredAlbums}
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
            <Text style={[styles.sectionTitle, styles.categoryHeading]}>Filtrar por gênero</Text>
            <View style={styles.categoryList}>
              {[{ label: 'Todos', value: null }, ...genres.map((genre) => ({ label: genre, value: genre }))]
                .map(({ label, value }) => {
                  const isSelected = selectedGenre === value;
                  return (
                    <Pressable
                      key={label}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      onPress={() => onSelectGenre(value)}
                      style={({ pressed }) => [
                        styles.categoryChip,
                        isSelected && styles.categoryChipSelected,
                        pressed && styles.categoryChipPressed,
                      ]}
                    >
                      <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}
            </View>
          </View>
        )}
        ListEmptyComponent={(
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>♫</Text>
            <Text style={styles.emptyTitle}>
              {selectedGenre ? 'Nenhum álbum neste gênero' : 'Sua coleção começa aqui'}
            </Text>
            <Text style={styles.emptyText}>
              {selectedGenre
                ? `Escolha outro gênero ou adicione um álbum de ${selectedGenre}.`
                : 'Adicione um álbum para começar a organizar suas músicas.'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
