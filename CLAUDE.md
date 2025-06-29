# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an asset management system called "asset-ui" designed for educational institutions managing laboratory equipment and supplies across multiple campuses (MSC and HSC). The system handles transaction forms for borrowing, returning, and tracking various types of assets including laboratory equipment, office supplies, medical equipment, and room reservations.

## Architecture

The project consists of:

1. **Frontend Applications**: Multiple HTML interfaces providing different user experiences:
   - `new-ui.html`: Modern single-page application with enhanced UI/UX, multi-step workflows, and real-time edit capabilities
   - Legacy interfaces for compatibility with existing systems

2. **Backend Integration**: REST API service layer with:
   - `regForm.service.js`: Complete API service for registration forms with CRUD operations, status management, and data validation
   - API endpoints for forms, items, rooms, staff, and inventory management
   - Authentication and authorization via Bearer tokens

3. **Utility Framework**: Comprehensive JavaScript utilities in `utilities.js`:
   - Enhanced Toast notifications with multiple types and batch operations
   - HTTP client with API abstraction and error handling
   - Form validation and data type handling
   - DataTable plugins with advanced selection features
   - Date/time utilities and localization support

4. **Database Structure**: MySQL database (`lsts_2020` schema) with tables for:
   - `asset_form_items`: Transaction form line items with quantities, status, and metadata
   - `asset_form_types`: Form type definitions with approval workflows and department assignments
   - `asset_transaction_forms`: Main transaction records with status tracking
   - `asset_category_view`: Asset catalog with categorization and specifications
   - `asset_storage_movements`: Inventory movement tracking

## Key Features

- **Modern Edit System**: Two-panel edit interface with real-time quantity adjustments, status changes, and API integration
- **Multi-Campus Support**: Separate workflows for MSC and HSC campuses with department-specific forms
- **Comprehensive Form Types**: 16+ form types including lab equipment (MSC/HSC), physics, medical, nutrition, arts, and room bookings
- **Advanced Asset Management**: Hierarchical categorization, serial number tracking, and availability checking
- **API-First Design**: localhost:9000 integration with graceful fallback to mock data
- **Responsive Design**: Bootstrap 4.6.2 with modern CSS gradients and glassmorphism effects

## Technology Stack

- **Frontend**: HTML5, Bootstrap 4.6.2, Font Awesome 5.15.4, modern CSS with CSS variables
- **Data Tables**: DataTables 1.13.7 with responsive extensions and custom checkbox selection
- **Form Controls**: Tom Select 2.3.1 for enhanced dropdowns with AJAX loading
- **JavaScript**: ES6+ features, async/await patterns, modular service architecture
- **Backend API**: RESTful endpoints expecting JSON payloads with Bearer authentication
- **Database**: MySQL (schema: `lsts_2020`)
- **Localization**: Vietnamese primary interface with English translations

## API Integration

The system integrates with a backend API at `localhost:9000` with the following key endpoints:

### Registration Forms
- `GET /api/forms` - List all forms with filtering
- `GET /api/forms/{id}` - Get specific form details
- `PUT /api/forms/{id}` - Update form data
- `POST /api/forms` - Create new form
- `DELETE /api/forms/{id}` - Delete form

### Assets and Resources  
- `GET /asset:item/getAll` - Get available items
- `GET /asset:item/getStorageItem` - Get items with storage info
- `GET /asset:room/getAll` - Get available rooms
- `GET /resource:staff/getAll` - Get staff list
- `POST /asset:registrationForm/checkAvailability` - Check item/room availability

## Common Development Commands

Since this is a frontend-only repository, development typically involves:

```bash
# Serve the application locally
python -m http.server 8000
# or
npx serve .

# Access the application
open http://localhost:8000/new-ui.html
```

## File Structure

```
/
├── new-ui.html                     # Modern enhanced UI with edit capabilities
├── regForm.service.js              # Complete API service layer
├── utilities.js                    # Comprehensive utility framework
├── old-ui.js                       # Legacy JavaScript for older interfaces  
├── old-ui.php                      # Legacy PHP interface
├── form_items.sql                  # Sample data for form items
├── form_types.sql                  # Form type configurations and sample data
└── CLAUDE.md                       # This documentation file
```

## Development Notes

- **API Integration**: Always use the `regForm.service.js` for API calls - it handles authentication, error handling, and data formatting
- **Form Validation**: Use the `FormType` utility class for consistent validation across forms
- **Toast Notifications**: Leverage the enhanced `Toast` module for user feedback - supports success, error, warning, info, and loading states
- **Data Tables**: Use the `LstsTable` wrapper for consistent table functionality with built-in checkbox selection
- **Date Handling**: Use `InputType` and `ConvertDate` utilities for consistent date formatting and validation
- **Multi-language Support**: All user-facing text should support Vietnamese (primary) and English translations
- **Error Handling**: API errors are automatically handled by the service layer with user-friendly notifications
- **Local Storage**: User authentication tokens and preferences are stored using `crm_get_localStorge()` and `crm_set_localStorge()` functions

## Form Type System

The system supports 16+ form types with specific workflows:

### Laboratory Forms
- `LAB_HSC`, `LAB_MSC`: Laboratory equipment borrowing
- `MAKERLAB_HSC`, `MAKERLAB_MSC`: Makerspace equipment
- `PHYSICS_HSC`, `PHYSICS_MSC`: Physics lab equipment

### Specialized Forms  
- `MEDICAL_*`: Medical equipment and supplies
- `NUTRITION_*`: Nutrition lab equipment
- `ART_*`: Art department supplies
- `ROOM_*`: Room and facility bookings
- `DAMAGE_*`: Equipment damage reporting

Each form type has specific validation rules, approval workflows, and available asset categories defined in the database.