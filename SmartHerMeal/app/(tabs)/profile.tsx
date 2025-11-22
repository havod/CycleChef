import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
//import { useAppStore, UserProfile } from '@/store/useAppStore';
import { useAppStore, UserProfile } from '../../store/useAppStore';
import { Picker } from '@react-native-picker/picker';

export default function ProfileScreen() {
  const { profile, updateProfile } = useAppStore();
  
  const [formData, setFormData] = useState<Partial<UserProfile>>(
    profile || {
      name: '',
      age: 25,
      gender: 'female',
      country: 'USA',
      dietaryPreferences: [],
      menstrualCycle: 'regular',
      healthConditions: [],
      weight: 60,
      weightUnit: 'kg',
      height: 165,
      heightUnit: 'cm',
      nutritionalGoals: [],
      activityLevel: 'moderately-active',
      budget: 100,
      budgetFrequency: 'weekly',
    }
  );

  const handleSubmit = () => {
    if (!formData.name || formData.age <= 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    updateProfile(formData as UserProfile);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const updateField = (field: keyof UserProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => updateField('name', text)}
          placeholder="Enter your name"
        />

        <Text style={styles.label}>Age *</Text>
        <TextInput
          style={styles.input}
          value={formData.age?.toString()}
          onChangeText={(text) => updateField('age', parseInt(text) || 0)}
          keyboardType="numeric"
          placeholder="Enter your age"
        />

        <Text style={styles.label}>Gender</Text>
        <Picker
          selectedValue={formData.gender}
          onValueChange={(value) => updateField('gender', value)}
          style={styles.picker}
        >
          <Picker.Item label="Female" value="female" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Non-binary" value="non-binary" />
          <Picker.Item label="Prefer not to say" value="prefer-not-to-say" />
        </Picker>

        <Text style={styles.label}>Country</Text>
        <TextInput
          style={styles.input}
          value={formData.country}
          onChangeText={(text) => updateField('country', text)}
          placeholder="Enter your country"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Physical Information</Text>
        
        <Text style={styles.label}>Weight</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.flex1]}
            value={formData.weight?.toString()}
            onChangeText={(text) => updateField('weight', parseFloat(text) || 0)}
            keyboardType="numeric"
            placeholder="Weight"
          />
          <Picker
            selectedValue={formData.weightUnit}
            onValueChange={(value) => updateField('weightUnit', value)}
            style={styles.unitPicker}
          >
            <Picker.Item label="kg" value="kg" />
            <Picker.Item label="lbs" value="lbs" />
          </Picker>
        </View>

        <Text style={styles.label}>Height</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.flex1]}
            value={formData.height?.toString()}
            onChangeText={(text) => updateField('height', parseFloat(text) || 0)}
            keyboardType="numeric"
            placeholder="Height"
          />
          <Picker
            selectedValue={formData.heightUnit}
            onValueChange={(value) => updateField('heightUnit', value)}
            style={styles.unitPicker}
          >
            <Picker.Item label="cm" value="cm" />
            <Picker.Item label="ft" value="ft" />
          </Picker>
        </View>

        <Text style={styles.label}>Activity Level</Text>
        <Picker
          selectedValue={formData.activityLevel}
          onValueChange={(value) => updateField('activityLevel', value)}
          style={styles.picker}
        >
          <Picker.Item label="Sedentary" value="sedentary" />
          <Picker.Item label="Lightly Active" value="lightly-active" />
          <Picker.Item label="Moderately Active" value="moderately-active" />
          <Picker.Item label="Very Active" value="very-active" />
          <Picker.Item label="Extremely Active" value="extremely-active" />
        </Picker>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Information</Text>
        
        <Text style={styles.label}>Menstrual Cycle</Text>
        <Picker
          selectedValue={formData.menstrualCycle}
          onValueChange={(value) => updateField('menstrualCycle', value)}
          style={styles.picker}
        >
          <Picker.Item label="Regular" value="regular" />
          <Picker.Item label="Irregular" value="irregular" />
          <Picker.Item label="Not Applicable" value="not-applicable" />
        </Picker>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budget</Text>
        
        <Text style={styles.label}>Weekly Budget</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.flex1]}
            value={formData.budget?.toString()}
            onChangeText={(text) => updateField('budget', parseFloat(text) || 0)}
            keyboardType="numeric"
            placeholder="Budget amount"
          />
          <Picker
            selectedValue={formData.budgetFrequency}
            onValueChange={(value) => updateField('budgetFrequency', value)}
            style={styles.unitPicker}
          >
            <Picker.Item label="Weekly" value="weekly" />
            <Picker.Item label="Bi-weekly" value="bi-weekly" />
            <Picker.Item label="Monthly" value="monthly" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#D0B7D6',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  picker: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  flex1: {
    flex: 1,
  },
  unitPicker: {
    width: 100,
  },
  button: {
    backgroundColor: '#D0B7D6',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});