// ALL THE CONTENT OF THE SITE LIVES HERE. Works by double-clicking main.html, no server needed.
const SITE = {
  profilePhoto: "data/profile_photo.jpg",

  // Birthday letter. Blank line = new paragraph.
  message:`Dear Ahona,
  
  Success is not final; failure is not fatal: It is the courage to continue that counts.
  `,

  // OPTIONAL: paste a Google Sheet "Publish to web" CSV link here to manage stories from the sheet instead.
  // Leave as "" to use the stories below.
  sheetUrl: "",

  // Memories. To add one: copy a { ... }, block, paste it at the end, and put the photo in the data folder.
  // photo is optional. If left out, it uses data/story1.jpg, data/story2.jpg ... by position.
  stories: [
    {
      title: "Khulna University",
      date: "20 Nov, 2025",
      photo: "story1.jpg",
      text: `Love`
    },
    {
      title: "Eating",
      date: "17 Oct, 2025",
      photo: "story2.jpg",
      text: `Eat and have fun`
    }
  ]
};
