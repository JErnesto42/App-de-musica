import React, { useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { styles } from './theme';
import BrandHeader from './BrandHeader';

const categories = [
  { id: 'albums', label: 'Álbuns' },
  { id: 'artists', label: 'Artistas' },
  { id: 'recommended', label: 'Recomendadas' },
];

function GenreFilters({ genres, selectedGenre, onSelectGenre }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.catalogFilters}
    >
      {[null, ...genres].map((genre) => {
        const label = genre ?? 'Todos';
        const isSelected = selectedGenre === genre;
        return (
          <Pressable
            key={label}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onSelectGenre(genre)}
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
    </ScrollView>
  );
}

function AlbumGrid({ albums, onSelectAlbum }) {
  if (albums.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Nenhum álbum por aqui</Text>
        <Text style={styles.emptyText}>Adicione álbuns ou escolha outro gênero.</Text>
      </View>
    );
  }

  return (
    <View style={styles.catalogGrid}>
      {albums.map((album) => (
        <Pressable
          key={album.id}
          accessibilityRole="button"
          accessibilityLabel={`Abrir ${album.title}`}
          style={styles.catalogAlbum}
          onPress={() => onSelectAlbum(album)}
        >
          <View style={styles.catalogCover}>
            {album.coverImage
              ? <Image source={{ uri: album.coverImage }} style={styles.coverImage} />
              : (
                <View style={styles.catalogFallback}>
                  <Text style={styles.coverText}>♫</Text>
                  <Text style={styles.catalogFallbackTitle} numberOfLines={2}>{album.title}</Text>
                </View>
              )}
          </View>
          <Text style={styles.catalogCaption} numberOfLines={1}>
            {album.artist} · {album.year}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function ArtistList({ artists, onSelectArtist }) {
  if (artists.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Nenhum artista neste gênero</Text>
        <Text style={styles.emptyText}>Escolha outro gênero para explorar os artistas.</Text>
      </View>
    );
  }

  return (
    <View style={styles.artistList}>
      {artists.map((artist) => (
        <Pressable
          key={artist.name}
          accessibilityRole="button"
          onPress={() => onSelectArtist(artist.name)}
          style={styles.artistItem}
        >
          <View style={styles.artistAvatar}><Text style={styles.artistAvatarText}>♫</Text></View>
          <View style={styles.artistItemInfo}>
            <Text style={styles.artistItemName}>{artist.name}</Text>
          </View>
          <Text style={styles.artistChevron}>›</Text>
        </Pressable>
      ))}
    </View>
  );
}

function SongList({ songs, onSelectSong, emptyTitle, emptyText, recent = false }) {
  if (songs.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>{emptyTitle}</Text>
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.songList}>
      {songs.map(({ song, album }, index) => (
        <Pressable
          key={`${album.id}-${song.id}-${index}`}
          accessibilityRole="button"
          accessibilityLabel={`Abrir ${song.title}, do álbum ${album.title}`}
          onPress={() => onSelectSong(album, song)}
          style={styles.catalogSong}
        >
          <View style={styles.songIndex}><Text style={styles.songIndexText}>♫</Text></View>
          <View style={styles.songItemInfo}>
            <Text style={styles.catalogSongTitle} numberOfLines={1}>{song.title}</Text>
            <Text style={styles.catalogSongCaption} numberOfLines={1}>
              {album.artist} · {album.title}
            </Text>
          </View>
          {recent ? <Text style={styles.recentArrow}>›</Text> : null}
        </Pressable>
      ))}
    </View>
  );
}

function SearchResults({ albums, artists, songs, query, onSelectAlbum, onSelectArtist, onSelectSong }) {
  const hasResults = albums.length > 0 || artists.length > 0 || songs.length > 0;

  if (!hasResults) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Ainda não encontramos isso</Text>
        <Text style={styles.emptyText}>
          Não há artista, álbum ou música com o nome “{query}” na sua coleção.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.searchResults}>
      {artists.length > 0 ? (
        <>
          <Text style={styles.searchResultHeading}>Artistas</Text>
          <ArtistList artists={artists} onSelectArtist={onSelectArtist} />
        </>
      ) : null}
      {albums.length > 0 ? (
        <>
          <Text style={styles.searchResultHeading}>Álbuns</Text>
          <AlbumGrid albums={albums} onSelectAlbum={onSelectAlbum} />
        </>
      ) : null}
      {songs.length > 0 ? (
        <>
          <Text style={styles.searchResultHeading}>Músicas</Text>
          <SongList
            songs={songs}
            onSelectSong={onSelectSong}
            emptyTitle=""
            emptyText=""
          />
        </>
      ) : null}
    </View>
  );
}

export default function CatalogHome({
  albums,
  category,
  onSelectCategory,
  albumGenre,
  onSelectAlbumGenre,
  artistGenre,
  onSelectArtistGenre,
  recentSongs,
  onSelectAlbum,
  onSelectArtist,
  onSelectSong,
  onOpenLibrary,
  onAddAlbum,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const normalizedQuery = searchQuery.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
  const genres = [...new Set(albums.map((album) => album.genre).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
  const songs = albums.flatMap((album) => (
    (album.songs ?? []).map((song) => ({ song, album }))
  ));
  const artists = [...new Set(albums.map((album) => album.artist).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b))
    .map((name) => {
      const artistAlbums = albums.filter((album) => album.artist === name);
      return {
        name,
        genres: [...new Set(artistAlbums.map((album) => album.genre).filter(Boolean))],
      };
    })
    .filter((artist) => !artistGenre || artist.genres.includes(artistGenre));

  const genreCounts = songs.reduce((counts, item) => {
    const genre = item.album.genre;
    if (genre) counts[genre] = (counts[genre] ?? 0) + 1;
    return counts;
  }, {});
  const recommendedGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([genre]) => genre);
  const recommendations = songs
    .slice()
    .sort((a, b) => (
      recommendedGenres.indexOf(a.album.genre) - recommendedGenres.indexOf(b.album.genre)
    ))
    .slice(0, 8);

  const recentItems = recentSongs
    .map(({ albumId, songId }) => {
      const album = albums.find((item) => item.id === albumId);
      const song = album?.songs?.find((item) => item.id === songId);
      return album && song ? { album, song } : null;
    })
    .filter(Boolean);
  const matches = (value) => value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .includes(normalizedQuery);
  const searchAlbums = normalizedQuery
    ? albums.filter((album) => matches(album.title))
    : [];
  const searchArtists = normalizedQuery
    ? [...new Set(albums.map((album) => album.artist).filter((artist) => artist && matches(artist)))]
      .map((name) => ({ name }))
    : [];
  const searchSongs = normalizedQuery
    ? songs.filter(({ song }) => matches(song.title))
    : [];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.homeContent}>
      <View style={styles.homeTopBar}>
        <BrandHeader />
        <Text style={styles.homeGreeting}>SUA BIBLIOTECA MUSICAL</Text>
      </View>

      <View style={styles.catalogHeader}>
        <View style={styles.catalogHeaderCopy}>
          <Text style={styles.title}>Sua coleção</Text>
          <Text style={styles.subtitle}>Álbuns, artistas e sons para descobrir.</Text>
        </View>
        <Pressable style={styles.buttonCompact} onPress={onAddAlbum}>
          <Text style={styles.buttonText}>＋ Álbum</Text>
        </Pressable>
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          accessibilityLabel="Pesquisar artista, álbum ou música"
          placeholder="Pesquisar artista, álbum ou música"
          placeholderTextColor="#777482"
          returnKeyType="search"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Limpar pesquisa"
            hitSlop={10}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.searchClear}>×</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.categoryTabs}>
        {categories.map(({ id, label }) => {
          const isSelected = category === id;
          return (
            <Pressable
              key={id}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelectCategory(id)}
              style={[styles.categoryTab, isSelected && styles.categoryTabSelected]}
            >
              <Text style={[styles.categoryTabText, isSelected && styles.categoryTabTextSelected]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {normalizedQuery ? (
        <SearchResults
          albums={searchAlbums}
          artists={searchArtists}
          songs={searchSongs}
          query={searchQuery.trim()}
          onSelectAlbum={onSelectAlbum}
          onSelectArtist={onSelectArtist}
          onSelectSong={onSelectSong}
        />
      ) : null}

      {!normalizedQuery && category === 'albums' ? (
        <>
          <GenreFilters
            genres={genres}
            selectedGenre={albumGenre}
            onSelectGenre={onSelectAlbumGenre}
          />
          <AlbumGrid
            albums={albums.filter((album) => !albumGenre || album.genre === albumGenre)}
            onSelectAlbum={onSelectAlbum}
          />
        </>
      ) : null}

      {!normalizedQuery && category === 'artists' ? (
        <>
          <GenreFilters
            genres={genres}
            selectedGenre={artistGenre}
            onSelectGenre={onSelectArtistGenre}
          />
          <ArtistList artists={artists} onSelectArtist={onSelectArtist} />
        </>
      ) : null}

      {!normalizedQuery && category === 'recommended' ? (
        <>
          <Text style={styles.recommendationNote}>
            Sugestões baseadas nos gêneros mais presentes na sua coleção.
          </Text>
          <SongList
            songs={recommendations}
            onSelectSong={onSelectSong}
            emptyTitle="Adicione músicas para receber sugestões"
            emptyText="As recomendações usam os gêneros mais presentes na sua coleção."
          />
        </>
      ) : null}

      {!normalizedQuery ? (
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Acessadas recentemente</Text>
            <Pressable onPress={onOpenLibrary}>
              <Text style={styles.textLink}>Biblioteca</Text>
            </Pressable>
          </View>
          <SongList
            songs={recentItems.map(({ album, song }) => ({ album, song }))}
            onSelectSong={onSelectSong}
            emptyTitle="Suas músicas recentes aparecerão aqui"
            emptyText="Abra uma música para encontrá-la rapidamente na próxima vez."
            recent
          />
        </View>
      ) : null}
    </ScrollView>
  );
}
