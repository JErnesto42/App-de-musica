import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import AlbumList from './screens/AlbumList';
import AlbumDetails from './screens/AlbumDetails';
import RecordForm from './screens/RecordForm';

const initialAlbums = [
  {
    id: '1',
    title: 'Noite em Movimento',
    artist: 'Luna Prado',
    genre: 'Pop alternativo',
    year: 2024,
    description: 'Canções para atravessar a cidade quando as luzes se acendem.',
    songs: [
      { id: '101', title: 'Luzes da Rua', duration: '3:42', composer: 'Luna Prado' },
      { id: '102', title: 'Último Trem', duration: '4:08', composer: 'Luna Prado' },
      { id: '103', title: 'Manhã de Vidro', duration: '3:26', composer: 'Luna Prado' },
    ],
  },
  {
    id: '2',
    title: 'Maré de Dentro',
    artist: 'Tomás Vale',
    genre: 'MPB',
    year: 2022,
    description: 'Um álbum acústico inspirado em paisagens e histórias do litoral.',
    songs: [
      { id: '201', title: 'Casa Azul', duration: '3:51', composer: 'Tomás Vale' },
      { id: '202', title: 'Sal no Ar', duration: '4:13', composer: 'Tomás Vale' },
    ],
  },
];

const albumsStorageKey = 'sonora.albums.v1';

function loadAlbums() {
  if (Platform.OS !== 'web' || typeof localStorage === 'undefined') return initialAlbums;

  try {
    const savedAlbums = localStorage.getItem(albumsStorageKey);
    if (!savedAlbums) return initialAlbums;

    const parsedAlbums = JSON.parse(savedAlbums);
    if (!Array.isArray(parsedAlbums)) {
      throw new Error('Os dados salvos dos álbuns não estão no formato esperado.');
    }
    return parsedAlbums;
  } catch (error) {
    console.error('Não foi possível carregar os álbuns salvos:', error);
    return initialAlbums;
  }
}

export default function App() {
  const [albums, setAlbums] = useState(loadAlbums);
  const [screen, setScreen] = useState('home');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [formType, setFormType] = useState('album');
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [formReturnScreen, setFormReturnScreen] = useState('library');
  const [formError, setFormError] = useState('');
  const [deleteRequest, setDeleteRequest] = useState(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(albumsStorageKey, JSON.stringify(albums));
    } catch (error) {
      console.error('Não foi possível salvar os álbuns no armazenamento do navegador:', error);
    }
  }, [albums]);

  const selectedAlbum = albums.find((album) => album.id === selectedAlbumId);

  const openAlbumForm = (album) => {
    setFormReturnScreen(screen);
    setFormError('');
    setDeleteRequest(null);
    setFormType('album');
    setEditingId(album?.id ?? null);
    setFormValues(album
      ? {
          title: album.title,
          artist: album.artist,
          genre: album.genre,
          year: String(album.year),
          description: album.description,
          coverImage: album.coverImage ?? null,
        }
      : { title: '', artist: '', genre: '', year: '', description: '', coverImage: null });
    setScreen('form');
  };

  const openSongForm = (song) => {
    setFormReturnScreen('details');
    setFormError('');
    setDeleteRequest(null);
    setFormType('song');
    setEditingId(song?.id ?? null);
    setFormValues(song
      ? { title: song.title, duration: song.duration, composer: song.composer ?? '' }
      : { title: '', duration: '', composer: '' });
    setScreen('form');
  };

  const saveForm = () => {
    if (formType === 'album') {
      const year = Number(formValues.year);
      if (
        !formValues.title?.trim() ||
        !formValues.artist?.trim() ||
        !formValues.genre?.trim() ||
        !formValues.description?.trim() ||
        !Number.isInteger(year) ||
        year < 1900 ||
        year > 2100
      ) {
        setFormError('Preencha os campos do álbum e informe um ano válido (entre 1900 e 2100).');
        return;
      }
      setFormError('');

      const albumData = {
        title: formValues.title.trim(),
        artist: formValues.artist.trim(),
        genre: formValues.genre.trim(),
        year,
        description: formValues.description.trim(),
        coverImage: formValues.coverImage ?? null,
      };

      if (editingId) {
        setAlbums((current) => current.map((album) =>
          album.id === editingId ? { ...album, ...albumData } : album
        ));
      } else {
        const newAlbum = { ...albumData, id: String(Date.now()), songs: [] };
        setAlbums((current) => [newAlbum, ...current]);
        setSelectedAlbumId(newAlbum.id);
        setScreen('details');
        return;
      }

      setScreen(formReturnScreen);
      return;
    }

    const durationMatch = /^(\d{1,2}):(\d{2})$/.exec(formValues.duration ?? '');
    if (!selectedAlbum || !formValues.title?.trim() || !durationMatch || Number(durationMatch[2]) > 59) {
      setFormError('Informe o título e a duração no formato minutos:segundos (ex.: 3:45).');
      return;
    }
    setFormError('');

    const songData = {
      title: formValues.title.trim(),
      duration: formValues.duration.trim(),
      composer: formValues.composer?.trim() ?? '',
    };

    setAlbums((current) => current.map((album) => {
      if (album.id !== selectedAlbumId) return album;
      const songs = editingId
        ? album.songs.map((song) => song.id === editingId ? { ...song, ...songData } : song)
        : [...album.songs, { ...songData, id: String(Date.now()) }];
      return { ...album, songs };
    }));
    setScreen('details');
  };

  const confirmDeletion = () => {
    if (deleteRequest?.type === 'album') {
      setAlbums((current) => current.filter((album) => album.id !== deleteRequest.id));
      setSelectedAlbumId(null);
      setScreen('library');
    } else if (deleteRequest?.type === 'song') {
      setAlbums((current) => current.map((album) => (
        album.id === selectedAlbumId
          ? { ...album, songs: album.songs.filter((song) => song.id !== deleteRequest.id) }
          : album
      )));
    }
    setDeleteRequest(null);
  };

  const cancelForm = () => setScreen(formReturnScreen);

  const pickAlbumCover = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        const imageContext = ImageManipulator.ImageManipulator.manipulate(asset.uri);
        imageContext.resize({ width: Math.min(asset.width || 600, 600) });
        const resizedImage = await imageContext.renderAsync();
        let compressedImage;
        try {
          compressedImage = await resizedImage.saveAsync({
            format: ImageManipulator.SaveFormat.JPEG,
            compress: 0.7,
            base64: true,
          });
        } finally {
          imageContext.release();
          resizedImage.release();
        }
        if (!compressedImage.base64) {
          throw new Error('A imagem comprimida não retornou os dados necessários para salvá-la.');
        }
        setFormValues((current) => ({
          ...current,
          coverImage: `data:image/jpeg;base64,${compressedImage.base64}`,
        }));
        setFormError('');
      }
    } catch (error) {
      setFormError('Não foi possível abrir suas imagens. Tente novamente.');
      console.error('Erro ao selecionar a capa do álbum:', error);
    }
  };

  return (
    <>
      <StatusBar style="light" backgroundColor="#111319" />
      {screen === 'home' && (
        <AlbumList
          albums={albums}
          home
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
          onOpenLibrary={() => setScreen('library')}
          onSelect={(album) => {
            setSelectedAlbumId(album.id);
            setScreen('details');
          }}
        />
      )}
      {screen === 'library' && (
        <AlbumList
          albums={albums}
          onAdd={() => openAlbumForm()}
          onSelect={(album) => {
            setDeleteRequest(null);
            setSelectedAlbumId(album.id);
            setScreen('details');
          }}
          onHome={() => {
            setDeleteRequest(null);
            setScreen('home');
          }}
        />
      )}
      {screen === 'details' && selectedAlbum && (
        <AlbumDetails
          album={selectedAlbum}
          onBack={() => {
            setDeleteRequest(null);
            setScreen('library');
          }}
          onEditAlbum={() => openAlbumForm(selectedAlbum)}
          onDeleteAlbum={() => setDeleteRequest({ type: 'album', id: selectedAlbum.id, title: selectedAlbum.title })}
          onAddSong={() => openSongForm()}
          onEditSong={openSongForm}
          onDeleteSong={(song) => setDeleteRequest({ type: 'song', id: song.id, title: song.title })}
          deleteRequest={deleteRequest}
          onConfirmDelete={confirmDeletion}
          onCancelDelete={() => setDeleteRequest(null)}
        />
      )}
      {screen === 'form' && (
        <RecordForm
          type={formType}
          isEditing={Boolean(editingId)}
          values={formValues}
          error={formError}
          onChange={(field, value) => {
            setFormValues((current) => ({ ...current, [field]: value }));
            setFormError('');
          }}
          onSave={saveForm}
          onCancel={cancelForm}
          onPickImage={pickAlbumCover}
        />
      )}
    </>
  );
}
