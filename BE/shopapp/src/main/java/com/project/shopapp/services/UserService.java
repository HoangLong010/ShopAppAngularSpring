package com.project.shopapp.services;

import com.project.shopapp.component.JwtTokenUtils;
import com.project.shopapp.component.LocalizationUtils;
import com.project.shopapp.dtos.UpdateUserDTO;
import com.project.shopapp.dtos.UserDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.exceptions.PermissionDenyException;
import com.project.shopapp.models.Role;
import com.project.shopapp.models.User;
import com.project.shopapp.repositories.RoleRepository;
import com.project.shopapp.repositories.UserRepository;
import com.project.shopapp.utils.MessageKeys;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtils jwtTokenUtil;
    private final AuthenticationManager authenticationManager;
    private final LocalizationUtils localizationUtils;

    @Override
    @Transactional
    // Register User
    public User createUser(UserDTO userDTO) throws Exception {
        // Kiểm tra xem số điện thoại có tồn tại không
        String phoneNumber = userDTO.getPhoneNumber();
        if (userRepository.existsByPhoneNumber(phoneNumber)) {
            throw new DataIntegrityViolationException("Phone number already exists");
        }
        Role role = roleRepository.findById(userDTO.getRoleId())
                .orElseThrow(() -> new DataNotFoundException("Role not found"));
        if(role.getName().toUpperCase().equals(Role.ADMIN)){
            throw new PermissionDenyException("You cannot register a admin account");
        }
        // convert from useDTO => user
        User newUser = User.builder()
                .fullName(userDTO.getFullName())
                .phoneNumber(userDTO.getPhoneNumber())
                .password(userDTO.getPassword())
                .address(userDTO.getAddress())
                .dateOfBirth(userDTO.getDateOfBirth())
                .facebookAccountId(userDTO.getFacebookAccountId())
                .googleAccountId(userDTO.getGoogleAccountId())
                .build();
        newUser.setRole(role);

        // Kiểm tra nếu có accoutId, không yêu cầu password
        if (userDTO.getGoogleAccountId() == 0 && userDTO.getFacebookAccountId() == 0) {
            String password = userDTO.getPassword();
            String encodedPassword = passwordEncoder.encode(password);
            newUser.setPassword(encodedPassword);
        }

        return userRepository.save(newUser);
    }

    @Override
    public String login(String phoneNumber, String password, Long roleId) throws Exception{
        Optional<User> optionalUser = userRepository.findByPhoneNumber(phoneNumber);
        if(optionalUser.isEmpty()){
            throw new DataNotFoundException(localizationUtils.getLocalizedMessage(MessageKeys.WRONG_PHONE_PASSWORD));
        }
        User existingUser = optionalUser.get();
        // check password
        if (existingUser.getGoogleAccountId() == 0 && existingUser.getFacebookAccountId() == 0) {
            if(!passwordEncoder.matches(password, existingUser.getPassword())){
                throw  new BadCredentialsException(localizationUtils.getLocalizedMessage(MessageKeys.WRONG_PHONE_PASSWORD));
            }

        }
        Optional<Role> optionalRole = roleRepository.findById(roleId);
        if(optionalRole.isEmpty()|| !roleId.equals(existingUser.getRole().getId())){
            throw new DataNotFoundException(localizationUtils.getLocalizedMessage(MessageKeys.ROLE_DOES_NOT_EXISTS));
        }

        if(!optionalUser.get().isActive()){
            throw new DataNotFoundException(localizationUtils.getLocalizedMessage(MessageKeys.USER_IS_LOCKED));
        }


        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                phoneNumber, password, existingUser.getAuthorities()
        );
        // authenticate with JavaSpring security
        authenticationManager.authenticate(authenticationToken);
        return jwtTokenUtil.generateToken(optionalUser.get());
    }

    @Override
    @Transactional
    public User updateUser(Long userId, UpdateUserDTO updatedUserDTO) throws Exception{
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("User not found"));

        String newPhoneNumber = updatedUserDTO.getPhoneNumber();
        if(!existingUser.getPhoneNumber().equals(newPhoneNumber) && userRepository.existsByPhoneNumber(newPhoneNumber)){
            throw new DataIntegrityViolationException("Phone number already exists");
        }

        if(updatedUserDTO.getFullName() != null){
            existingUser.setFullName(updatedUserDTO.getFullName());
        }
        if(newPhoneNumber != null){
            existingUser.setPhoneNumber(newPhoneNumber);
        }
        if(updatedUserDTO.getAddress() != null){
            existingUser.setAddress(updatedUserDTO.getAddress());
        }

        if(updatedUserDTO.getDateOfBirth() != null){
            existingUser.setDateOfBirth(updatedUserDTO.getDateOfBirth());
        }

        if(updatedUserDTO.getFacebookAccountId() > 0){
            existingUser.setFacebookAccountId(updatedUserDTO.getFacebookAccountId());
        }

        if(updatedUserDTO.getGoogleAccountId() > 0){
            existingUser.setGoogleAccountId(updatedUserDTO.getGoogleAccountId());
        }

        if(updatedUserDTO.getPassword() != null
                && !updatedUserDTO.getPassword().isEmpty()){
            String newPassword = updatedUserDTO.getPassword();
            String encodePassword = passwordEncoder.encode(newPassword);
            existingUser.setPassword(encodePassword);

        }

        return userRepository.save(existingUser);
    }

    @Override
    public User getUserDetailsFromToken(String token) throws Exception {
        if(jwtTokenUtil.isTokenExpired(token)){
            throw new Exception("Token is expired");
        }
        String phoneNumber = jwtTokenUtil.extractPhoneNumber(token);
        Optional<User> user = userRepository.findByPhoneNumber(phoneNumber);
        if(user.isPresent()){
            return user.get();
        } else {
            throw new Exception("User not found");
        }
    }
}
