import React, { useState, useEffect } from "react";
import { careerService } from "../../services/career";

const formatNestedData = (occupationGroups, occupations, specializations) =>
  occupationGroups.map(group => ({
    ...group,
    occupations: occupations
      .filter(occ => occ.groupId === group.id)
      .map(occ => ({
        ...occ,
        specializations: specializations.filter(spec => spec.occupationId === occ.id)
      })),
  }));

function TestAPI() {
  const [specializations, setSpecializations] = useState([]);
  const [occupations, setOccupations] = useState([]);
  const [occupationGroups, setOccupationGroups] = useState([]);
  const [nestedCareerData, setNestedCareerData] = useState([]);

  // Fetch API helpers
  const testViewSpecialization = async () => {
    try {
      const result = await careerService.viewSpecialization();
      return Array.isArray(result) ? result : result?.data || [];
    } catch (error) {
      console.error("viewSpecialization error:", error);
      return [];
    }
  };

  const testViewOccupations = async () => {
    try {
      const result = await careerService.viewOccupations();
      return Array.isArray(result) ? result : result?.data || [];
    } catch (error) {
      console.error("viewOccupations error:", error);
      return [];
    }
  };

  const testViewOccupationGroups = async () => {
    try {
      const result = await careerService.viewOccupationGroups();
      return Array.isArray(result) ? result : result?.data || [];
    } catch (error) {
      console.error("viewOccupationGroups error:", error);
      return [];
    }
  };

  // Auto fetch and format nested data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [specs, occs, groups] = await Promise.all([
          testViewSpecialization(),
          testViewOccupations(),
          testViewOccupationGroups(),
        ]);
        setSpecializations(specs);
        setOccupations(occs);
        setOccupationGroups(groups);

        const nested = formatNestedData(groups, occs, specs);
        setNestedCareerData(nested);
        console.log("Nested Career Data:", nested);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">API Test Page</h1>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Test Careers</h2>
        <div className="space-x-2">
          <button
            onClick={async () => {
              const res = await testViewSpecialization();
              setSpecializations(res);
              console.log("Specializations:", res);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Test viewSpecialization
          </button>
          <button
            onClick={async () => {
              const res = await testViewOccupations();
              setOccupations(res);
              console.log("Occupations:", res);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Test viewOccupations
          </button>
          <button
            onClick={async () => {
              const res = await testViewOccupationGroups();
              setOccupationGroups(res);
              console.log("Occupation Groups:", res);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Test viewOccupationGroups
          </button>
          <button
            onClick={() => {
              const nested = formatNestedData(occupationGroups, occupations, specializations);
              setNestedCareerData(nested);
              console.log("Nested Career Data:", nested);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Generate Nested Data
          </button>
        </div>
      </section>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Click each button to test the corresponding API call</li>
          <li>Check browser console (F12) for results</li>
          <li>
            After calling all 3 APIs, click <b>Generate Nested Data</b> to see the full structure!
          </li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-white rounded">
        <h3 className="font-semibold mb-2">Nested Data Preview (first group):</h3>
        <pre className="text-xs overflow-x-auto" style={{ maxHeight: 300 }}>
          {JSON.stringify(nestedCareerData[0], null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default TestAPI;
