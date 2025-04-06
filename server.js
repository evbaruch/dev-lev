app.post("/api/updatePageData", (req, res) => {
  const { id, updates } = req.body;

  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const pages = JSON.parse(data);

    const pageIndex = pages.findIndex((page) => page.id === id);
    if (pageIndex === -1) {
      return res.status(404).json({ error: `Page with ID ${id} not found.` });
    }

    const page = pages[pageIndex];
    if (updates.likes !== undefined) {
      page.likes = updates.likes;
    }
    if (updates.views !== undefined) {
      page.views = updates.views;
    }
    if (updates.comments !== undefined) {
      page.comments = updates.comments; // Save the full list of comments
    }

    fs.writeFileSync(filePath, JSON.stringify(pages, null, 2), "utf-8");
    res.json({ message: `Page with ID ${id} updated successfully.` });
  } catch (error) {
    console.error("Error updating page data:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});