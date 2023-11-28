const Skill = require("../model/skills");

const addSkill = async (req, res) => {
  try {
    const { skills } = req.body;

    const newSkill = new Skill({ skills });
    const savedSkill = await newSkill.save();

    res.status(201).json(savedSkill);
  } catch (error) {
    console.error("Error adding skill:", error);
    res.status(500).json({ error: "Unable to add skill" });
  }
};

  const getAllSkills = async (req, res) => {
    try {
      const skills = await Skill.find({}, "skills"); 

      const skillValues = skills.map((skill) => skill.skills);
  
      res.status(200).json(skillValues);
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ error: "Unable to fetch skills" });
    }
  };
  

module.exports = {
  addSkill,
  getAllSkills,
};
