
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
        },
        {
          id: '3',
          name: 'Maitre Paul Biya',
          email: 'paul.biya@legal.cm',
          licenseNumber: 'BAR009012',
          specialization: 'Family Law',
          experienceYears: 8,
          practiceAreas: ['Family Law', 'Divorce', 'Child Custody'],
          languages: ['French', 'English', 'Bamoun'],
          officeAddress: 'Quartier Mvog-Ada, Yaoundé, Cameroon',
          phone: '+237 655 123 456',
          description: 'Compassionate family law attorney helping families through difficult times with sensitivity and expertise.',
          rating: 4.7,
          reviewCount: 28,
          isVerified: true
        },
        {
          id: '4',
          name: 'Maitre Fatima Hassan',
          email: 'fatima.hassan@immigration.cm',
          licenseNumber: 'BAR003456',
          specialization: 'Immigration Law',
          experienceYears: 10,
          practiceAreas: ['Immigration Law', 'Refugee Law', 'Citizenship'],
          languages: ['French', 'Arabic', 'Fulfulde', 'English'],
          officeAddress: 'Rue de Bordeaux, Douala, Cameroon',
          phone: '+237 678 901 234',
          description: 'Dedicated immigration lawyer helping individuals and families navigate complex immigration processes.',
          rating: 4.9,
          reviewCount: 35,
          isVerified: true
        },
        {
          id: '5',
          name: 'Maitre Emmanuel Nkomo',
          email: 'emmanuel.nkomo@business.cm',
          licenseNumber: 'BAR007890',
          specialization: 'Business Law',
          experienceYears: 20,
          practiceAreas: ['Business Law', 'Contract Law', 'Intellectual Property'],
          languages: ['English', 'French', 'Bassa'],
          officeAddress: 'Avenue Charles de Gaulle, Douala, Cameroon',
          phone: '+237 699 876 543',
          description: 'Experienced business attorney specializing in corporate formation, contracts, and intellectual property protection.',
          rating: 4.5,
          reviewCount: 52,
          isVerified: true
        }
      ];

      // Apply all filters and search
      let filteredLawyers = mockLawyers;

      // Search functionality - search across multiple fields
      if (searchTerm.trim()) {
        const searchTermLower = searchTerm.toLowerCase().trim();
        filteredLawyers = filteredLawyers.filter(lawyer =>
          lawyer.name.toLowerCase().includes(searchTermLower) ||
          lawyer.specialization.toLowerCase().includes(searchTermLower) ||
          lawyer.description.toLowerCase().includes(searchTermLower) ||
          lawyer.practiceAreas.some(area => area.toLowerCase().includes(searchTermLower)) ||
          lawyer.languages.some(lang => lang.toLowerCase().includes(searchTermLower)) ||
          lawyer.officeAddress.toLowerCase().includes(searchTermLower)
        );
      }

      // Specialization filter
      if (filters.specialization) {
        filteredLawyers = filteredLawyers.filter(lawyer =>
          lawyer.specialization === filters.specialization ||
          lawyer.practiceAreas.includes(filters.specialization)
        );
      }

      // Experience filter
      if (filters.minExperience > 0) {
        filteredLawyers = filteredLawyers.filter(lawyer =>
          lawyer.experienceYears >= filters.minExperience
        );
      }

      // Language filter
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

        {/* Enhanced Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search lawyers by name, specialization, location, or practice area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Specialization Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Specialization
                </label>
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
                  <option value="Business Law">Business Law</option>
                  <option value="Civil Rights">Civil Rights</option>
                  <option value="Personal Injury">Personal Injury</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Employment Law">Employment Law</option>
                  <option value="Tax Law">Tax Law</option>
                  <option value="Intellectual Property">Intellectual Property</option>
                </select>
              </div>

              {/* Experience Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Experience
                </label>
                <select
                  value={filters.minExperience}
                  onChange={(e) => setFilters(prev => ({ ...prev, minExperience: parseInt(e.target.value) }))}
                  className="input-field"
                >
                  <option value="0">Any Experience</option>
                  <option value="3">3+ Years</option>
                  <option value="5">5+ Years</option>
                  <option value="10">10+ Years</option>
                  <option value="15">15+ Years</option>
                  <option value="20">20+ Years</option>
                </select>
              </div>

              {/* Language Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Language
                </label>
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
                  <option value="Bassa">Bassa</option>
                  <option value="Bamoun">Bamoun</option>
                  <option value="Arabic">Arabic</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({
                      specialization: '',
                      minExperience: 0,
                      language: ''
                    });
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  disabled={!searchTerm && !filters.specialization && !filters.language && filters.minExperience === 0}
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || filters.specialization || filters.language || filters.minExperience > 0) && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-1 text-primary hover:text-primary-dark"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.specialization && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {filters.specialization}
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, specialization: '' }))}
                      className="ml-1 text-blue-800 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.language && (
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {filters.language}
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, language: '' }))}
                      className="ml-1 text-green-800 hover:text-green-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.minExperience > 0 && (
                  <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                    {filters.minExperience}+ years
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, minExperience: 0 }))}
                      className="ml-1 text-purple-800 hover:text-purple-900"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results Summary and Sorting */}
        {!loading && (
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {lawyers.length === 0 ? (
                "No lawyers found"
              ) : (
                `Showing ${lawyers.length} lawyer${lawyers.length !== 1 ? 's' : ''}`
              )}
              {(searchTerm || filters.specialization || filters.language || filters.minExperience > 0) && (
                <span> matching your criteria</span>
              )}
            </div>

            {lawyers.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                <select
                  onChange={(e) => {
                    const sortBy = e.target.value;
                    const sortedLawyers = [...lawyers].sort((a, b) => {
                      switch (sortBy) {
                        case 'rating':
                          return b.rating - a.rating;
                        case 'experience':
                          return b.experienceYears - a.experienceYears;
                        case 'name':
                          return a.name.localeCompare(b.name);
                        case 'reviews':
                          return b.reviewCount - a.reviewCount;
                        default:
                          return 0;
                      }
                    });
                    setLawyers(sortedLawyers);
                  }}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="experience">Most Experienced</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Lawyers Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Loading lawyers...</p>
          </div>
        ) : lawyers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No lawyers found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {(searchTerm || filters.specialization || filters.language || filters.minExperience > 0) 
                ? "Try adjusting your search criteria or filters."
                : "No lawyers are currently available in our directory."
              }
            </p>
            {(searchTerm || filters.specialization || filters.language || filters.minExperience > 0) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({
                    specialization: '',
                    minExperience: 0,
                    language: ''
                  });
                }}
                className="text-primary hover:text-primary-dark font-medium"
              >
                Clear all filters
              </button>
            )}
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
  );
};

export default LawyerDirectoryScreen;
