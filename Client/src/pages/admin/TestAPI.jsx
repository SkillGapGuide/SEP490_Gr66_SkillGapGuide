import React from 'react';
import { userAdminService } from '../../services/userAdminService';
import { staticPageService } from '../../services/staticPageService';
import { feedbackService } from '../../services/feedbackService';
import { scrapeJobService } from '../../services/scrapService';

function TestAPI() {
  // Test User Admin Service
  const testGetAllUsers = async () => {
    try {
      const result = await userAdminService.getAllUsers({
        searchText: "",
        role: "",
        status: "",
        pageNo: 0,
        pageSize: 5
      });
      console.log("getAllUsers result:", result);
    } catch (error) {
      console.error("getAllUsers error:", error);
    }
  };

  const testGetUserByEmail = async () => {
    try {
      const result = await userAdminService.getUserByEmail("admin@example.com");
      console.log("getUserByEmail result:", result);
    } catch (error) {
      console.error("getUserByEmail error:", error);
    }
  };

  // Test Static Page Service
  const testGetStaticPages = async () => {
    try {
      console.group('Static Pages GET Tests');
      
      const terms = await staticPageService.getTermsOfService();
      console.log('Terms of Service:', terms);
      
      const social = await staticPageService.getSocialLink();
      console.log('Social Links:', social);
      
      const privacy = await staticPageService.getPrivacy();
      console.log('Privacy Policy:', privacy);
      
      const home = await staticPageService.getHomePage();
      console.log('Home Page:', home);
      
      const about = await staticPageService.getAboutUs();
      console.log('About Us:', about);
      
      console.groupEnd();
    } catch (error) {
      console.error('Error testing static pages GET:', error);
    }
  };

  const testUpdateStaticPages = async () => {
    const testData = {
      title: "Test Title",
      content: "Test Content " + new Date().toISOString()
    };

    try {
      console.group('Static Pages UPDATE Tests');
      
      const terms = await staticPageService.updateTermsOfService(testData);
      console.log('Update Terms:', terms);
      
      const social = await staticPageService.updateSocialLink(testData);
      console.log('Update Social:', social);
      
      const privacy = await staticPageService.updatePrivacy(testData);
      console.log('Update Privacy:', privacy);
      
      const home = await staticPageService.updateHomePage(testData);
      console.log('Update Home:', home);
      
      const about = await staticPageService.updateAboutUs(testData);
      console.log('Update About:', about);
      
      console.groupEnd();
    } catch (error) {
      console.error('Error testing static pages UPDATE:', error);
    }
  };

  // Test Feedback Service
  const testGetFeedbacks = async () => {
    try {
      const result = await feedbackService.getAllFeedbacks({
        star: 0,
        pageNo: 0,
        pageSize: 10
      });
      console.log("getAllFeedbacks result:", result);
    } catch (error) {
      console.error("getAllFeedbacks error:", error);
    }
  };

  // Test Scrape Service
  const testScrapeJob = async () => {
    try {
      const result = await scrapeJobService.scrapeJob("https://example.com/job");
      console.log("scrapeJob result:", result);
    } catch (error) {
      console.error("scrapeJob error:", error);
    }
  };

  const testAboutUs = async () => {
    try {
      console.group('About Us Tests');
      
      // Test Get
      const aboutData = await staticPageService.getAboutUs();
      console.log('Get About Us:', aboutData);

      // Test Update
      const updateData = [
        {
          title: "Về chúng tôi",
          content: "Test content 1 " + new Date().toISOString()
        },
        {
          title: "Sứ mệnh",
          content: "Test content 2 " + new Date().toISOString()
        }
      ];
      const updateResult = await staticPageService.updateAboutUs(updateData);
      console.log('Update About Us:', updateResult);

      console.groupEnd();
    } catch (error) {
      console.error('About Us test error:', error);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">API Test Page</h1>
      
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">User Admin Tests</h2>
        <div className="space-x-2">
          <button onClick={testGetAllUsers} className="px-4 py-2 bg-blue-500 text-white rounded">
            Test Get All Users
          </button>
          <button onClick={testGetUserByEmail} className="px-4 py-2 bg-blue-500 text-white rounded">
            Test Get User by Email
          </button>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Static Pages Tests</h2>
        <div className="flex gap-2">
          <button 
            onClick={testGetStaticPages} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Get Static Pages
          </button>
          <button 
            onClick={testUpdateStaticPages} 
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Test Update Static Pages
          </button>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Feedback Tests</h2>
        <button onClick={testGetFeedbacks} className="px-4 py-2 bg-yellow-500 text-white rounded">
          Test Get Feedbacks
        </button>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Scrape Tests</h2>
        <button onClick={testScrapeJob} className="px-4 py-2 bg-purple-500 text-white rounded">
          Test Scrape Job
        </button>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">About Us Tests</h2>
        <button 
          onClick={testAboutUs}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Test About Us
        </button>
      </section>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Click each button to test the corresponding API call</li>
          <li>Check browser console (F12) for results</li>
          <li>Results will show success data or error messages</li>
        </ul>
      </div>
    </div>
  );
}

export default TestAPI;
