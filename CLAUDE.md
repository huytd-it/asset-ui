# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an asset management system called "asset-ui" that handles transaction forms for laboratory equipment and supplies. The system appears to be designed for educational institutions managing laboratory assets across multiple campuses (MSC and HSC).

## Architecture

The project consists of:

1. **Frontend Application**: A single-page HTML application (`enhanced_transaction_forms.html`) that provides:
   - Asset transaction form management interface
   - Multi-step form workflow with progress indicators
   - Interactive tables with filtering and search capabilities
   - Responsive design using Bootstrap 4

2. **Database Structure**: MySQL database with tables for:
   - `asset_form_items`: Transaction form line items with quantities, status, and metadata
   - `asset_form_types`: Form type definitions with approval workflows and department assignments
   - `asset_transaction_forms`: Main transaction records with status tracking
   - `asset_category_view`: Asset catalog with categorization and specifications
   - `asset_storage_movements`: Inventory movement tracking

## Key Features

- **Form Management**: Multi-type transaction forms (borrowing, damage reporting, room requests, medical supplies)
- **Asset Categories**: Hierarchical categorization system for laboratory equipment and consumables
- **Storage Tracking**: Movement history and quantity management
- **Approval Workflows**: Different approval chains based on form type and department
- **Multi-Campus Support**: Separate handling for MSC and HSC campuses

## Technology Stack

- **Frontend**: HTML5, Bootstrap 4.6.2, Font Awesome 5.15.4
- **Data Tables**: DataTables 1.13.7 with responsive extensions
- **Form Controls**: Tom Select 2.3.1 for enhanced select inputs
- **Database**: MySQL (schema: `lsts_2020`)
- **Language**: Vietnamese interface with English translations for some fields

## Development Notes

- The main interface is a single HTML file with embedded CSS and JavaScript
- Database operations appear to be handled server-side (no backend code visible in this repository)
- Asset items are managed with hierarchical codes (e.g., G02-02-15, G02-TN-19)
- Status tracking includes: pending, in_progress, completed, issued, borrowed, damaged
- Form types include different departments: lab (MSC/HSC), physics, medical, nutrition, arts

## File Structure

```
/
├── enhanced_transaction_forms.html  # Main application interface
├── form_items.sql                  # Sample data for form items
├── form_types.sql                  # Form type configurations and sample data
└── CLAUDE.md                       # This documentation file
```

The SQL files contain sample data and schema information that can help understand the data model and relationships between different entities in the system.