import React from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { styles } from './theme';
import BrandHeader from './BrandHeader';

const albumFields = [
  { key: 'title', label: 'Nome do álbum', placeholder: 'Ex.: Cores do Amanhã' },
  { key: 'artist', label: 'Artista', placeholder: 'Nome do artista ou banda' },
  { key: 'genre', label: 'Gênero musical', placeholder: 'Ex.: MPB, rock, jazz' },
  { key: 'year', label: 'Ano de lançamento', placeholder: '2024', keyboardType: 'number-pad' },
  { key: 'description', label: 'Sobre o álbum', placeholder: 'Uma breve descrição', multiline: true },
];

const songFields = [
  { key: 'title', label: 'Nome da faixa', placeholder: 'Ex.: Canção de Verão' },
  { key: 'duration', label: 'Duração', placeholder: '3:45' },
  { key: 'composer', label: 'Composição (opcional)', placeholder: 'Compositor(a)' },
];

export default function RecordForm({ type, isEditing, values, error, onChange, onSave, onCancel, onPickImage }) {
  const isAlbum = type === 'album';
  const fields = isAlbum ? albumFields : songFields;
  const action = isEditing ? 'Editar' : isAlbum ? 'Novo' : 'Nova';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <BrandHeader />
      <Pressable onPress={onCancel} hitSlop={10} style={{ marginBottom: 18 }}>
        <Text style={styles.backLink}>‹ Cancelar e voltar</Text>
      </Pressable>
      <View style={styles.header}>
        <Text style={styles.title}>
          {action} {isAlbum ? 'álbum' : 'faixa'}
        </Text>
        <Text style={styles.subtitle}>
          {isAlbum ? 'Preencha os dados da sua coleção.' : 'Inclua os detalhes desta música.'}
        </Text>
      </View>
      <View style={styles.form}>
        {isAlbum ? (
          <View style={styles.coverPicker}>
            <View style={styles.coverPreview}>
              {values.coverImage
                ? <Image source={{ uri: values.coverImage }} style={styles.coverImage} />
                : <Text style={styles.coverText}>♫</Text>}
            </View>
            <View style={styles.coverPickerInfo}>
              <Text style={styles.label}>Capa do álbum</Text>
              <Text style={styles.coverHint}>Escolha uma imagem quadrada para representar seu álbum.</Text>
              <Pressable style={styles.outlineButton} onPress={onPickImage}>
                <Text style={styles.outlineButtonText}>
                  {values.coverImage ? 'Trocar imagem' : 'Escolher imagem'}
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}
        {fields.map((field) => (
          <View key={field.key}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={[styles.input, field.multiline && styles.inputMultiline]}
              placeholder={field.placeholder}
              placeholderTextColor="#777482"
              value={values[field.key] ?? ''}
              onChangeText={(value) => onChange(field.key, value)}
              keyboardType={field.keyboardType}
              multiline={field.multiline}
              autoCapitalize={field.key === 'year' ? 'none' : 'sentences'}
            />
          </View>
        ))}
        {error ? <Text style={styles.formError}>{error}</Text> : null}
        <View style={styles.formActions}>
          <Pressable style={[styles.secondaryButton, styles.formButton]} onPress={onCancel}>
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.formButton]} onPress={onSave}>
            <Text style={styles.buttonText}>Salvar</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
