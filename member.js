function skillsMember(member) {
  return member.skills.map(skill => {
    return {
      id: skill.id,
      name: skill.name
    };
  });
}