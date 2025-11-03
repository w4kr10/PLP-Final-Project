import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Heart, MessageCircle, Apple, ShoppingBag } from 'lucide-react';
import Header from '../components/layout/Header';
import { useSelector } from 'react-redux';
import MarketplaceProducts from '../components/marketplace/MarketplaceProducts';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Component */}
      <Header />

      {/* Hero Section */}
      <section id="medical" className="bg-primary-500 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Supporting Every Step of Your Motherhood Journey
          </h2>
          <p className="text-lg text-white/90 mb-10 max-w-3xl mx-auto">
            Connecting pregnant mothers, new parents, and children under 5 to trusted medical care, expert advice, and comprehensive nutrition guidance.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="bg-white text-primary-500 border border-primary-500 px-8 py-3 rounded-lg font-medium hover:bg-sky-300 transition flex items-center space-x-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Find Medical Care</span>
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-primary-500 px-8 py-3 rounded-lg font-medium hover:bg-sky-300"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Pregnancy & Postpartum Support Section */}
      <section id="pregnancy" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Connect to Trusted Medical Care
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Access reliable healthcare resources and programs designed specifically for mothers and children. Always consult with healthcare professionals for personalized medical advice.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* WIC Program Card */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 rounded bg-primary-100 flex items-center justify-center">
                  <Apple className="h-6 w-6 text-primary-500" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">WIC Program</h4>
              </div>
              <p className="text-gray-600">
                Nutrition education, healthy food, and support for pregnant women.
              </p>
            </div>

            {/* HRSA Card */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 rounded bg-orange-100 flex items-center justify-center">
                  <span className="text-2xl">😊</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900">HRSA Healthy Start</h4>
              </div>
              <p className="text-gray-600">
                Community-based programs offering comprehensive services.
              </p>
            </div>

            {/* Every Mother Counts Card */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 rounded bg-green-100 flex items-center justify-center">
                  <span className="text-2xl">♀️</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900">Every Mother Counts</h4>
              </div>
              <p className="text-gray-600">
                Working to make maternal health safe and equitable for mothers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Postpartum Support Section */}
      <section id="postpartum" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Postpartum Care & Support
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Schedule appointments with healthcare professionals for postpartum checkups, mental health support, and infant care guidance.
            </p>
            <div className="mt-8">
              <Button
                onClick={() => navigate('/register')}
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3"
              >
                Book Postpartum Appointment
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section id="marketplace" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <ShoppingBag className="h-8 w-8 text-green-500" />
              Healthy Marketplace
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our collection of healthy grocery products specially curated for pregnant mothers and families. Sign in to place orders and get them delivered to your doorstep.
            </p>
          </div>

          {/* Show Marketplace */}
          <div className="mb-8">
            {!user ? (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 text-center">
                <p className="text-blue-900 mb-4 font-semibold">Please log in to place orders and access all marketplace features</p>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => navigate('/login')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Log In
                  </Button>
                  <Button
                    onClick={() => navigate('/register')}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
            ) : null}
            <MarketplaceProducts />
          </div>
        </div>
      </section>

      {/* AI Assistant & Recipes Section */}
      <section id="recipes" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              🍳 Healthy Recipes & Meal Planning
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover pregnancy-safe recipes and personalized meal plans created by our AI assistant. Get nutritious meal ideas tailored to your trimester and dietary needs.
            </p>
            <div className="mt-8">
              <Button
                onClick={() => navigate('/register')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              >
                Explore Meal Planner
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="ai" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              🤖 AI Health Assistant
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get instant answers to your pregnancy and health questions from our AI-powered assistant. Available 24/7 to provide guidance and support.
            </p>
            <div className="mt-8">
              <Button
                onClick={() => navigate('/register')}
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3"
              >
                Chat with AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="font-bold mb-4">About Us</h5>
              <p className="text-gray-400 text-sm">Supporting mothers and children with trusted healthcare.</p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Services</h5>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white">Medical Care</a></li>
                <li><a href="#" className="hover:text-white">Nutrition</a></li>
                <li><a href="#" className="hover:text-white">Pregnancy Support</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Resources</h5>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Legal</h5>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Mother & Child Wellness Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
