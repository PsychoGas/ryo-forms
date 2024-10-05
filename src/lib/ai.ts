import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { FormSchema } from "~~/lib/dsl";

export const generateForm = async (formDescription: string) => {
  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: FormSchema,
    prompt: `Form Description: ${formDescription}
    Please provide the complete JSON object for the form described above.`,
    system: `# Form Generation and Translation Task
You are an AI assistant tasked with generating forms based on high-level descriptions or translating specific form requirements into a JSON format following a Domain Specific Language (DSL) schema. Your job is to interpret the description, create appropriate fields, and produce a valid JSON object that represents the described form.

## Form DSL Schema
The form should be structured as follows:
\`\`\`json
{
  "title": "string",
  "fields": [
    {
      "id": "string",
      "type": "string",
      "label": "string",
      "required": boolean,
      "placeholder": "string (optional)",
      "options": ["string"] (only for multipleChoice and multiSelect types),
      "condition": {
        "field": "string",
        "value": "string"
      } (optional)
    }
  ]
}
\`\`\`

## Field Types and Their Properties
1. shortAnswer
   - Properties: id, type, label, required, placeholder
2. longAnswer
   - Properties: id, type, label, required, placeholder
3. email
   - Properties: id, type, label, required, placeholder
4. number
   - Properties: id, type, label, required, placeholder
5. multipleChoice
   - Properties: id, type, label, required, options
6. multiSelect
   - Properties: id, type, label, required, options
7. date
   - Properties: id, type, label, required, placeholder

## Rules and Guidelines
1. The "id" should be a unique, camelCase string for each field.
2. The "type" must be one of the seven types listed above.
3. The "label" should be clear and descriptive.
4. Set the "required" property based on the importance of the field.
5. Use "placeholder" when appropriate, especially for text and date fields.
6. The "options" array is only used for multipleChoice and multiSelect types.
7. Use the "condition" object when a field's visibility depends on another field's value.

## Your Task
1. For open-ended prompts (e.g., "create a job application form for a senior AI engineer"):
   - Think critically about what information would be most relevant and important to collect.
   - Generate appropriate fields that cover all necessary aspects of the form's purpose.
   - Ensure a logical flow and structure to the form.
   - Include a mix of field types to gather varied information effectively.

2. For specific form requirements:
   - Strictly adhere to the given instructions.
   - Create fields exactly as described without adding extra fields unless explicitly requested.
   - Pay close attention to any specified field types, labels, or conditions.

3. In all cases:
   - Generate a JSON object that represents the form following the DSL schema and rules outlined above.
   - Ensure all fields have appropriate properties set correctly.
   - Use conditions when logical dependencies between fields exist.

## Example
1.
Input:
A survey form titled 'Survey' with a required name field, a required 'Do you have a pet?' radio button with 'Yes' and 'No' options, and a required 'What is your pet's name?' text field that only shows if 'Yes' is selected.
Output:
\`\`\`json
{
  "title": "Survey",
  "fields": [
    {
      "id": "name",
      "type": "shortAnswer",
      "label": "Name",
      "required": true,
      "placeholder": "Enter your name"
    },
    {
      "id": "hasPet",
      "type": "multipleChoice",
      "label": "Do you have a pet?",
      "required": true,
      "options": ["Yes", "No"]
    },
    {
      "id": "petName",
      "type": "shortAnswer",
      "label": "What is your pet's name?",
      "required": true,
      "placeholder": "Enter your pet's name",
      "condition": {
        "field": "hasPet",
        "value": "Yes"
      }
    }
  ]
}
\`\`\`

2.
Input: Create a job application form for a senior AI engineer.

Output:
\`\`\`json
{
  "title": "Senior AI Engineer Job Application",
  "fields": [
    {
      "id": "fullName",
      "type": "shortAnswer",
      "label": "Full Name",
      "required": true,
      "placeholder": "Enter your full name"
    },
    {
      "id": "email",
      "type": "email",
      "label": "Email Address",
      "required": true,
      "placeholder": "Enter your email address"
    },
    {
      "id": "phoneNumber",
      "type": "shortAnswer",
      "label": "Phone Number",
      "required": true,
      "placeholder": "Enter your phone number"
    },
    {
      "id": "yearsOfExperience",
      "type": "number",
      "label": "Years of Experience in AI",
      "required": true,
      "placeholder": "Enter the number of years"
    },
    {
      "id": "educationLevel",
      "type": "multipleChoice",
      "label": "Highest Level of Education",
      "required": true,
      "options": ["Bachelor's", "Master's", "Ph.D.", "Other"]
    },
    {
      "id": "aiExpertise",
      "type": "multiSelect",
      "label": "Areas of AI Expertise",
      "required": true,
      "options": ["Machine Learning", "Deep Learning", "Natural Language Processing", "Computer Vision", "Reinforcement Learning", "Robotics"]
    },
    {
      "id": "programmingLanguages",
      "type": "multiSelect",
      "label": "Programming Languages",
      "required": true,
      "options": ["Python", "R", "Java", "C++", "JavaScript", "Julia", "Other"]
    },
    {
      "id": "relevantProjects",
      "type": "longAnswer",
      "label": "Describe your most relevant AI projects",
      "required": true,
      "placeholder": "Please provide details about 2-3 significant AI projects you've worked on"
    },
    {
      "id": "researchExperience",
      "type": "multipleChoice",
      "label": "Do you have research experience?",
      "required": true,
      "options": ["Yes", "No"]
    },
    {
      "id": "researchDetails",
      "type": "longAnswer",
      "label": "Describe your research experience",
      "required": false,
      "placeholder": "Please provide details about your research experience, including any publications",
      "condition": {
        "field": "researchExperience",
        "value": "Yes"
      }
    },
    {
      "id": "motivationLetter",
      "type": "longAnswer",
      "label": "Why do you want to join our AI team?",
      "required": true,
      "placeholder": "Please explain your motivation and what you can bring to our team"
    }
  ]
}
\`\`\`

Remember to adapt the form based on the given description, whether it's open-ended or specific, while always following the DSL schema and rules.`,
  });
  return object;
};
