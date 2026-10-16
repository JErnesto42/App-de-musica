import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { styles } from './theme';
import BrandHeader from './BrandHeader';

export default function AlbumDetails({
  album,
  onBack,
  onEditAlbum,
  onDeleteAlbum,
  onAddSong,
  onEditSong,
  onDeleteSong,
  deleteRequest,
  onConfirmDelete,
  onCancelDelete,
}) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <BrandHeader />
      <Pressable onPress={onBack} hitSlop={10} style={{ marginBottom: 18 }}>
        <Text style={styles.backLink}>‹ Voltar para os álbuns</Text>
      </Pressable>

      <View style={styles.detailCard}>
        <View style={styles.albumCardTop}>
          <View style={[styles.cover, styles.detailCover]}>
            {album.coverImage
              ? <Image source={{ uri: album.coverImage }} style={styles.coverImage} />
              : <Text style={[styles.coverText, styles.detailCoverIcon]}>♫</Text>}
          </View>
          <View style={styles.albumCardInfo}>
            <Text style={styles.title}>{album.title}</Text>
            <Text style={styles.albumArtist}>{album.artist}</Text>
          </View>
        </View>
        <View style={styles.tags}>
          <View style={styles.tag}><Text style={styles.tagText}>{album.genre}</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>{album.year}</Text></View>
        </View>
        <Text style={styles.detailDescription}>{album.description}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={[styles.secondaryButton, styles.actionFlex]} onPress={onEditAlbum}>
          <Text style={styles.secondaryButtonText}>Editar álbum</Text>
        </Pressable>
        <Pressable style={[styles.dangerButton, styles.actionFlex]} onPress={onDeleteAlbum}>
          <Text style={styles.dangerButtonText}>Excluir</Text>
        </Pressable>
      </View>

      {deleteRequest ? (
        <View style={[styles.detailCard, { borderColor: '#74414A' }]}>
          <Text style={styles.sectionTitle}>Confirmar exclusão</Text>
          <Text style={styles.detailDescription}>
            Deseja excluir "{deleteRequest.title}"{deleteRequest.type === 'album' ? ' e todas as faixas do álbum' : ''}?
          </Text>
          <View style={[styles.actions, { marginBottom: 0, marginTop: 16 }]}>
            <Pressable style={[styles.secondaryButton, styles.actionFlex]} onPress={onCancelDelete}>
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </Pressable>
            <Pressable style={[styles.dangerButton, styles.actionFlex]} onPress={onConfirmDelete}>
              <Text style={styles.dangerButtonText}>Excluir</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <View style={[styles.albumCard, styles.tracksCard]}>
        <View style={styles.tracksHeader}>
          <Text style={styles.sectionTitle}>Faixas</Text>
          <Pressable onPress={onAddSong} hitSlop={8}>
            <Text style={[styles.tagText, { fontSize: 14 }]}>＋ Adicionar</Text>
          </Pressable>
        </View>
        {album.songs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Ainda não há faixas</Text>
            <Text style={styles.emptyText}>Adicione músicas para completar este álbum.</Text>
          </View>
        ) : album.songs.map((song, index) => (
          <View key={song.id} style={styles.trackRow}>
            <Text style={styles.trackNumber}>{String(index + 1).padStart(2, '0')}</Text>
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle}>{song.title}</Text>
              {song.composer ? <Text style={styles.trackComposer}>{song.composer}</Text> : null}
            </View>
            <Text style={styles.trackDuration}>{song.duration}</Text>
            <Pressable onPress={() => onEditSong(song)} accessibilityLabel={`Editar ${song.title}`}>
              <Text style={styles.trackAction}>✎</Text>
            </Pressable>
            <Pressable onPress={() => onDeleteSong(song)} accessibilityLabel={`Excluir ${song.title}`}>
              <Text style={[styles.trackAction, { color: '#E47D88' }]}>×</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
