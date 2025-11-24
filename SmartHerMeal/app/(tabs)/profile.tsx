import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useAppStore, UserProfile } from '../../store/useAppStore';
import { Ionicons } from '@expo/vector-icons';

// Custom Dropdown Component
interface DropdownProps {
  value: string;
  items: { label: string; value: string }[];
  onValueChange: (value: string) => void;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ value, items, onValueChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedItem = items.find(item => item.value === value);

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedItem?.label || placeholder || 'Select...'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    item.value === value && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    onValueChange(item.value);
                    setIsOpen(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    item.value === value && styles.modalItemTextSelected
                  ]}>
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Ionicons name="checkmark" size={20} color="#D0B7D6" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

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

  // Dropdown options
  const genderOptions = [
    { label: 'Female', value: 'female' },
    { label: 'Male', value: 'male' },
    { label: 'Non-binary', value: 'non-binary' },
    { label: 'Prefer not to say', value: 'prefer-not-to-say' },
  ];

  const weightUnitOptions = [
    { label: 'kg', value: 'kg' },
    { label: 'lbs', value: 'lbs' },
  ];

  const heightUnitOptions = [
    { label: 'cm', value: 'cm' },
    { label: 'ft', value: 'ft' },
  ];

  const activityLevelOptions = [
    { label: 'Sedentary', value: 'sedentary' },
    { label: 'Lightly Active', value: 'lightly-active' },
    { label: 'Moderately Active', value: 'moderately-active' },
    { label: 'Very Active', value: 'very-active' },
    { label: 'Extremely Active', value: 'extremely-active' },
  ];

  const menstrualCycleOptions = [
    { label: 'Regular', value: 'regular' },
    { label: 'Irregular', value: 'irregular' },
    { label: 'Not Applicable', value: 'not-applicable' },
  ];

  const budgetFrequencyOptions = [
    { label: 'Weekly', value: 'weekly' },
    { label: 'Bi-weekly', value: 'bi-weekly' },
    { label: 'Monthly', value: 'monthly' },
  ];

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
        <Dropdown
          value={formData.gender || 'female'}
          items={genderOptions}
          onValueChange={(value) => updateField('gender', value)}
        />

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
            style={styles.halfInput}
            value={formData.weight?.toString()}
            onChangeText={(text) => updateField('weight', parseFloat(text) || 0)}
            keyboardType="numeric"
            placeholder="Weight"
          />
          <Dropdown
            value={formData.weightUnit || 'kg'}
            items={weightUnitOptions}
            onValueChange={(value) => updateField('weightUnit', value)}
          />
        </View>

        <Text style={styles.label}>Height</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.halfInput}
            value={formData.height?.toString()}
            onChangeText={(text) => updateField('height', parseFloat(text) || 0)}
            keyboardType="numeric"
            placeholder="Height"
          />
          <Dropdown
            value={formData.heightUnit || 'cm'}
            items={heightUnitOptions}
            onValueChange={(value) => updateField('heightUnit', value)}
          />
        </View>

        <Text style={styles.label}>Activity Level</Text>
        <Dropdown
          value={formData.activityLevel || 'moderately-active'}
          items={activityLevelOptions}
          onValueChange={(value) => updateField('activityLevel', value)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Information</Text>
        
        <Text style={styles.label}>Menstrual Cycle</Text>
        <Dropdown
          value={formData.menstrualCycle || 'regular'}
          items={menstrualCycleOptions}
          onValueChange={(value) => updateField('menstrualCycle', value)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budget</Text>
        
        <Text style={styles.label}>Budget Amount</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.halfInput}
            value={formData.budget?.toString()}
            onChangeText={(text) => updateField('budget', parseFloat(text) || 0)}
            keyboardType="numeric"
            placeholder="Budget amount"
          />
          <Dropdown
            value={formData.budgetFrequency || 'weekly'}
            items={budgetFrequencyOptions}
            onValueChange={(value) => updateField('budgetFrequency', value)}
          />
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
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  halfInput: {
    flex: 0.6,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  // Dropdown styles
  dropdownContainer: {
    flex: 1.4,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '80%',
    maxHeight: '60%',
    overflow: 'hidden',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemSelected: {
    backgroundColor: '#F5F0F6',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalItemTextSelected: {
    color: '#D0B7D6',
    fontWeight: '600',
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