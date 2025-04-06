import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GenericPage from "./components/GenericPage/GenericPage";
import Button from "./components/Button/Button";

function App() {
  const [genericPagesData, setGenericPagesData] = useState([]);

  useEffect(() => {
    // Fetch data from the local JSON file
    fetch("/data/pages.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => setGenericPagesData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Function to update the genericPagesData state
  const updatePageData = (pageId, updates) => {
    setGenericPagesData((prevData) =>
      prevData.map((page) =>
        page.id === pageId ? { ...page, ...updates } : page
      )
    );
  };

  return (
    <Router>
      <Routes>
        {/* Home Route */}
        <Route
          path="/"
          element={
            <div className="grid-container">
              {genericPagesData.map((page) => (
                <Button
                  key={page.id}
                  image={page.images[0].url}
                  description={page.images[0].description}
                  text={page.texts[0].title}
                  contributors={page.contributors.map((contributor) => contributor.url)}
                  likes={page.likes}
                  views={page.views}
                  comments={page.comments.length}
                  link={`/page/${page.id}`} // Pass the link directly to the Button
                />
              ))}
            </div>
          }
        />

        {/* GenericPage Routes */}
        {genericPagesData.map((page) => (
          <Route
            key={page.id}
            path={`/page/${page.id}`}
            element={
              <GenericPage
                pageId={page.id}
                images={page.images}
                texts={page.texts}
                contributors={page.contributors}
                likes={page.likes}
                views={page.views}
                comments={page.comments}
                onUpdatePageData={updatePageData} // Pass the update function
              />
            }
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;