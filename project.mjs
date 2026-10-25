export function buildProjectBrief({name, email, company, message}, plan, extras) {
  return ['Code&Craft project inquiry', '', `Name: ${name.trim()}`, `Email: ${email.trim()}`, ...(company.trim() ? [`Company: ${company.trim()}`] : []), `Starting point: ${plan}`, `Extras: ${extras.length ? extras.join(', ') : 'None selected'}`, '', 'Project idea:', message.trim()].join('\n');
}
