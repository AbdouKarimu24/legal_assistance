
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Lawyer {
  id: string;
  name: string;
  email: string;
  licenseNumber: string;
  specialization: string;
  experienceYears: number;
  practiceAreas: string[];
  languages: string[];
  officeAddress: string;
  phone: string;
  description: string;
  profileImage?: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
}

interface LawyerDirectoryScreenProps {
  onBecomeLawyer: () => void;
}

const LawyerDirectoryScreen: React.FC<LawyerDirectoryScreenProps> = ({ onBecomeLawyer }) => {
  const { user } = useAuth();
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    specialization: '',
    minExperience: 0,
    language: ''
  });

  useEffect(() => {
    loadLawyers();
  }, [searchTerm, filters]);

  const loadLawyers = async () => {
    try {
      setLoading(true);
      // Mock API call - replace with actual database call
      const mockLawyers: Lawyer[] = [
        {
          id: '1',
          name: 'Maitre Jean Dupont',
          email: 'jean.dupont@lawfirm.cm',
          licenseNumber: 'BAR001234',
          specialization: 'Corporate Law',
          experienceYears: 15,
          practiceAreas: ['Corporate Law', 'Tax Law', 'Real Estate'],
          languages: ['French', 'English', 'Duala'],
          officeAddress: 'Rue de la Réunification, Douala, Cameroon',
          phone: '+237 691 234 567',
          description: 'Experienced corporate lawyer with 15+ years helping businesses navigate legal complexities in Cameroon and Central Africa.',
          rating: 4.8,
          reviewCount: 45,
          isVerified: true
        },
        {
          id: '2',
          name: 'Maitre Marie Ngono',
          email: 'marie.ngono@advocates.cm',
          licenseNumber: 'BAR005678',
          specialization: 'Criminal Law',
          experienceYears: 12,
          practiceAreas: ['Criminal Law', 'Civil Rights', 'Family Law'],
          languages: ['English', 'French', 'Ewondo'],
          officeAddress: 'Avenue Kennedy, Yaoundé, Cameroon',
          phone: '+237 677 345 678',
          description: 'Dedicated criminal defense attorney committed to protecting your rights and ensuring fair legal representation.',
          rating: 4.6,
          reviewCount: 32,
          isVerified: true
        }
      ];

      // Filter lawyers based on search and filters
      let filteredLawyers = mockLawyers;
      
      if (searchTerm) {
        filteredLawyers = filteredLawyers.filter(lawyer =>
          lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lawyer.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lawyer.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filters.specialization) {
        filteredLawyers = filteredLawyers.filter(lawyer =>
          lawyer.specialization === filters.specialization
        );
      }

      if (filters.minExperience > 0) {
        filteredLawyers = filteredLawyers.filter(lawyer =>
          lawyer.experienceYears >= filters.minExperience
        );
      }

      if (filters.language) {
        filteredLawyers = filteredLawyers.filter(lawyer =>
          lawyer.languages.includes(filters.language)
        );
      }

      setLawyers(filteredLawyers);
    } catch (error) {
      console.error('Error loading lawyers:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  if (selectedLawyer) {
    return (
      <LawyerDetailView
        lawyer={selectedLawyer}
        onBack={() => setSelectedLawyer(null)}
        currentUser={user}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Add Lawyer Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Find Legal Experts
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Connect with qualified lawyers in Cameroon
            </p>
          </div>
          
          {/* Add Lawyer Button */}
          <button
            onClick={onBecomeLawyer}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Become a Lawyer
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div>
              <input
                type="text"
                placeholder="Search lawyers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Specialization Filter */}
            <div>
              <select
                value={filters.specialization}
                onChange={(e) => setFilters(prev => ({ ...prev, specialization: e.target.value }))}
                className="input-field"
              >
                <option value="">All Specializations</option>
                <option value="Corporate Law">Corporate Law</option>
                <option value="Criminal Law">Criminal Law</option>
                <option value="Family Law">Family Law</option>
                <option value="Immigration Law">Immigration Law</option>
                <option value="Civil Rights">Civil Rights</option>
                <option value="Personal Injury">Personal Injury</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Employment Law">Employment Law</option>
              </select>
            </div>

            {/* Experience Filter */}
            <div>
              <select
                value={filters.minExperience}
                onChange={(e) => setFilters(prev => ({ ...prev, minExperience: parseInt(e.target.value) }))}
                className="input-field"
              >
                <option value="0">Any Experience</option>
                <option value="5">5+ Years</option>
                <option value="10">10+ Years</option>
                <option value="15">15+ Years</option>
                <option value="20">20+ Years</option>
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <select
                value={filters.language}
                onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
                className="input-field"
              >
                <option value="">Any Language</option>
                <option value="English">English</option>
                <option value="French">French</option>
                <option value="Duala">Duala</option>
                <option value="Ewondo">Ewondo</option>
                <option value="Fulfulde">Fulfulde</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lawyers Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Loading lawyers...</p>
          </div>
        ) : lawyers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No lawyers found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lawyers.map((lawyer) => (
              <div
                key={lawyer.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedLawyer(lawyer)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {lawyer.name}
                      </h3>
                      <p className="text-primary font-medium">
                        {lawyer.specialization}
                      </p>
                      <div className="flex items-center mt-1">
                        {renderStars(Math.floor(lawyer.rating))}
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          {lawyer.rating} ({lawyer.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                    {lawyer.isVerified && (
                      <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
                        Verified
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {lawyer.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                      </svg>
                      {lawyer.experienceYears} years experience
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {lawyer.officeAddress.split(',')[1]?.trim()}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {lawyer.languages.slice(0, 3).map((lang) => (
                        <span
                          key={lang}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs"
                        >
                          {lang}
                        </span>
                      ))}
                      {lawyer.languages.length > 3 && (
                        <span className="text-gray-500 text-xs px-2 py-1">
                          +{lawyer.languages.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );</old_str>

const LawyerDirectoryScreen: React.FC<LawyerDirectoryScreenProps> = ({ onBecomeLawyer }) => {
  const { user } = useAuth();
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [minExperience, setMinExperience] = useState(0);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);

  const specializations = [
    'Corporate Law',
    'Criminal Law',
    'Family Law',
    'Immigration Law',
    'Civil Rights',
    'Personal Injury',
    'Real Estate',
    'Intellectual Property',
    'Employment Law',
    'Tax Law'
  ];

  const languages = [
    'English',
    'French',
    'Duala',
    'Fulfulde',
    'Ewondo',
    'Bassa',
    'Bamoun',
    'Arabic'
  ];

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchLawyers = async () => {
      setLoading(true);
      try {
        // Mock API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockLawyers: Lawyer[] = [
          {
            id: '1',
            name: 'Dr. Marie Kouam',
            email: 'marie.kouam@lawfirm.cm',
            licenseNumber: 'BAR001234',
            specialization: 'Corporate Law',
            experienceYears: 15,
            practiceAreas: ['Corporate Law', 'Tax Law', 'Real Estate'],
            languages: ['French', 'English', 'Duala'],
            officeAddress: 'Rue de la Réunification, Douala, Cameroon',
            phone: '+237 691 234 567',
            description: 'Experienced corporate lawyer with 15+ years helping businesses navigate legal complexities.',
            rating: 4.8,
            reviewCount: 45,
            isVerified: true
          },
          {
            id: '2',
            name: 'Maître Jean Ngwa',
            email: 'jean.ngwa@justice.cm',
            licenseNumber: 'BAR005678',
            specialization: 'Criminal Law',
            experienceYears: 12,
            practiceAreas: ['Criminal Law', 'Civil Rights'],
            languages: ['English', 'French', 'Ewondo'],
            officeAddress: 'Avenue Kennedy, Yaoundé, Cameroon',
            phone: '+237 677 345 678',
            description: 'Dedicated criminal defense attorney committed to protecting your rights.',
            rating: 4.6,
            reviewCount: 32,
            isVerified: true
          },
          {
            id: '3',
            name: 'Maître Fatima Bello',
            email: 'fatima.bello@family-law.cm',
            licenseNumber: 'BAR009012',
            specialization: 'Family Law',
            experienceYears: 8,
            practiceAreas: ['Family Law', 'Immigration Law'],
            languages: ['French', 'Arabic', 'Fulfulde'],
            officeAddress: 'Quartier Deido, Douala, Cameroon',
            phone: '+237 656 789 012',
            description: 'Compassionate family law attorney specializing in divorce, custody, and immigration matters.',
            rating: 4.9,
            reviewCount: 28,
            isVerified: true
          }
        ];
        
        setLawyers(mockLawyers);
        setFilteredLawyers(mockLawyers);
      } catch (error) {
        console.error('Error fetching lawyers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyers();
  }, []);

  // Filter lawyers based on search criteria
  useEffect(() => {
    let filtered = lawyers;

    if (searchTerm) {
      filtered = filtered.filter(lawyer =>
        lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecialization) {
      filtered = filtered.filter(lawyer =>
        lawyer.specialization === selectedSpecialization ||
        lawyer.practiceAreas.includes(selectedSpecialization)
      );
    }

    if (selectedLanguage) {
      filtered = filtered.filter(lawyer =>
        lawyer.languages.includes(selectedLanguage)
      );
    }

    if (minExperience > 0) {
      filtered = filtered.filter(lawyer =>
        lawyer.experienceYears >= minExperience
      );
    }

    setFilteredLawyers(filtered);
  }, [lawyers, searchTerm, selectedSpecialization, selectedLanguage, minExperience]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  if (selectedLawyer) {
    return (
      <LawyerDetailView
        lawyer={selectedLawyer}
        onBack={() => setSelectedLawyer(null)}
        currentUser={user}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Find Legal Experts
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Connect with qualified lawyers in Cameroon
              </p>
            </div>
            <button
              onClick={onBecomeLawyer}
              className="btn-primary"
            >
              Become a Lawyer
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search lawyers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Specialization
              </label>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="input-field"
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="input-field"
              >
                <option value="">All Languages</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min. Experience
              </label>
              <select
                value={minExperience}
                onChange={(e) => setMinExperience(parseInt(e.target.value))}
                className="input-field"
              >
                <option value={0}>Any Experience</option>
                <option value={5}>5+ Years</option>
                <option value={10}>10+ Years</option>
                <option value={15}>15+ Years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading lawyers...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLawyers.map(lawyer => (
              <div
                key={lawyer.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedLawyer(lawyer)}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {lawyer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {lawyer.name}
                      </h3>
                      {lawyer.isVerified && (
                        <span className="text-green-500 text-sm">✓</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {lawyer.specialization}
                    </p>
                    <div className="flex items-center mt-1">
                      {renderStars(Math.floor(lawyer.rating))}
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {lawyer.rating} ({lawyer.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-2">
                  {lawyer.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                    {lawyer.experienceYears} years exp.
                  </span>
                  {lawyer.languages.slice(0, 2).map(lang => (
                    <span key={lang} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredLawyers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No lawyers found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Lawyer Detail Component
const LawyerDetailView: React.FC<{
  lawyer: Lawyer;
  onBack: () => void;
  currentUser: any;
}> = ({ lawyer, onBack, currentUser }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmittingReview(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Review submitted successfully!');
      setRating(0);
      setReview('');
    } catch (error) {
      alert('Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onStarClick?: (star: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-xl cursor-pointer ${i < rating ? 'text-yellow-400' : 'text-gray-300'} ${interactive ? 'hover:text-yellow-300' : ''}`}
        onClick={() => interactive && onStarClick && onStarClick(i + 1)}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-primary hover:text-primary-dark"
        >
          ← Back to Directory
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="flex items-start space-x-6 mb-8">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {lawyer.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {lawyer.name}
                </h1>
                {lawyer.isVerified && (
                  <span className="text-green-500 text-lg">✓ Verified</span>
                )}
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                {lawyer.specialization}
              </p>
              <div className="flex items-center mb-4">
                {renderStars(Math.floor(lawyer.rating))}
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  {lawyer.rating} ({lawyer.reviewCount} reviews)
                </span>
              </div>
              <div className="flex space-x-4">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded">
                  {lawyer.experienceYears} years experience
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                  License: {lawyer.licenseNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                  <p className="text-gray-600 dark:text-gray-400">{lawyer.email}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Phone:</span>
                  <p className="text-gray-600 dark:text-gray-400">{lawyer.phone}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Office:</span>
                  <p className="text-gray-600 dark:text-gray-400">{lawyer.officeAddress}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Languages & Practice Areas
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Languages:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {lawyer.languages.map(lang => (
                      <span key={lang} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Practice Areas:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {lawyer.practiceAreas.map(area => (
                      <span key={area} className="px-2 py-1 bg-primary/10 text-primary text-sm rounded">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              About
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {lawyer.description}
            </p>
          </div>

          {/* Rating Form */}
          {currentUser && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Rate this Lawyer
              </h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Rating
                  </label>
                  <div className="flex space-x-1">
                    {renderStars(rating, true, setRating)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Review (Optional)
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="input-field"
                    rows={4}
                    placeholder="Share your experience with this lawyer..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={rating === 0 || isSubmittingReview}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LawyerDirectoryScreen;
